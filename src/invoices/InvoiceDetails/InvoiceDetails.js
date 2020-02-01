import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';

import {
  Accordion,
  AccordionSet,
  Col,
  ConfirmationModal,
  ExpandAllButton,
  Pane,
  Row,
  PaneMenu,
  IconButton,
} from '@folio/stripes/components';
import {
  FundDistributionView,
  useModalToggle,
  useAccordionToggle,
} from '@folio/stripes-acq-components';

import {
  calculateAdjustmentAmount,
  IS_EDIT_POST_APPROVAL,
} from '../../common/utils';
import { INVOICE_STATUS } from '../../common/constants';
import {
  SECTIONS_INVOICE,
} from '../constants';
import ActionMenu from './ActionMenu';
import InvoiceActions from './InvoiceActions';
import Information from './Information';
import InvoiceLines, { InvoiceLinesActions } from './InvoiceLines';
import VendorDetails from './VendorDetails';
import VoucherInformationContainer from './VoucherInformation';
import DocumentsDetails from './DocumentsDetails';
import AdjustmentsDetails from '../AdjustmentsDetails';
import styles from './InvoiceDetails.css';

function InvoiceDetails({
  addLines,
  createLine,
  deleteInvoice,
  invoice,
  invoiceTotalUnits,
  onClose,
  onEdit,
  tagsEnabled,
  tagsToggle,
  totalInvoiceLines,
}) {
  const [showConfirmDelete, toggleDeleteConfirmation] = useModalToggle();
  const [expandAll, sections, toggleSection] = useAccordionToggle({
    [SECTIONS_INVOICE.DOCUMENTS]: false,
  });

  // eslint-disable-next-line react/prop-types
  const renderActionMenu = ({ onToggle }) => {
    return (
      <ActionMenu
        onEdit={() => {
          onToggle();
          onEdit();
        }}
        onDelete={() => {
          onToggle();
          toggleDeleteConfirmation();
        }}
      />
    );
  };

  const renderLinesActions = (
    <InvoiceLinesActions
      createLine={createLine}
      addLines={addLines}
      isDisabled={IS_EDIT_POST_APPROVAL(invoice.id, invoice.status)}
    />
  );

  const vendorInvoiceNo = invoice.vendorInvoiceNo;
  const showVoucherInformation = [INVOICE_STATUS.approved, INVOICE_STATUS.paid].includes(invoice.status);
  const tags = get(invoice, 'tags.tagList', []);
  const adjustments = get(invoice, 'adjustments');
  const fundDistributions = useMemo(
    () => adjustments.reduce((acc, adjustment) => {
      if (adjustment.fundDistributions) {
        adjustment.fundDistributions.forEach((distr) => {
          acc.push({
            ...distr,
            adjustmentDescription: adjustment.description,
            totalAmount: calculateAdjustmentAmount(adjustment, invoice.subTotal, invoice.currency),
          });
        });
      }

      return acc;
    }, []),
    [adjustments, invoice.currency, invoice.subTotal],
  );

  const paneTitle = (
    <FormattedMessage
      id="ui-invoice.invoice.details.paneTitle"
      values={{ vendorInvoiceNo }}
    />
  );

  const lastMenu = (
    <PaneMenu>
      {tagsEnabled && (
        <FormattedMessage id="ui-invoice.showTags">
          {(title) => (
            <IconButton
              data-test-invoice-tags-action
              ariaLabel={title}
              badgeCount={tags.length}
              icon="tag"
              id="clickable-show-tags"
              onClick={tagsToggle}
              title={title}
            />
          )}
        </FormattedMessage>
      )}
    </PaneMenu>
  );

  return (
    <Pane
      id="pane-invoiceDetails"
      defaultWidth="fill"
      dismissible
      onClose={onClose}
      paneTitle={paneTitle}
      actionMenu={renderActionMenu}
      lastMenu={lastMenu}
    >
      <Row end="xs">
        <Col xs={12}>
          <InvoiceActions
            invoiceLinesCount={totalInvoiceLines}
            invoice={invoice}
          />
          <ExpandAllButton
            accordionStatus={sections}
            onToggle={expandAll}
          />
        </Col>
      </Row>
      <AccordionSet
        accordionStatus={sections}
        onToggle={toggleSection}
      >
        <Accordion
          label={<FormattedMessage id="ui-invoice.invoice.details.information.title" />}
          id={SECTIONS_INVOICE.INFORMATION}
        >
          <Information
            adjustmentsTotal={invoice.adjustmentsTotal}
            approvalDate={invoice.approvalDate}
            approvedBy={invoice.approvedBy}
            invoiceDate={invoice.invoiceDate}
            paymentDue={invoice.paymentDue}
            paymentTerms={invoice.paymentTerms}
            status={invoice.status}
            subTotal={invoice.subTotal}
            total={invoice.total}
            source={invoice.source}
            metadata={invoice.metadata}
            billTo={invoice.billTo}
            invoiceTotalUnits={invoiceTotalUnits}
            acqUnits={invoice.acqUnitIds}
            currency={invoice.currency}
          />
        </Accordion>
        <Accordion
          label={<FormattedMessage id="ui-invoice.invoice.details.lines.title" />}
          id={SECTIONS_INVOICE.LINES}
          displayWhenOpen={renderLinesActions}
          displayWhenClosed={
            <div className={styles.invoiceLinesCount}>
              {totalInvoiceLines}
            </div>
          }
        >
          <InvoiceLines
            currency={invoice.currency}
            invoiceId={invoice.id}
          />
        </Accordion>
        <Accordion
          id={SECTIONS_INVOICE.FUND_DISTRIBUTION}
          label={<FormattedMessage id="ui-invoice.fundDistribution" />}
        >
          <FundDistributionView
            currency={invoice.currency}
            fundDistributions={fundDistributions}
          />
        </Accordion>
        <Accordion
          label={<FormattedMessage id="ui-invoice.adjustments" />}
          id={SECTIONS_INVOICE.ADJUSTMENTS}
        >
          <AdjustmentsDetails
            adjustments={adjustments}
            currency={invoice.currency}
          />
        </Accordion>
        <Accordion
          label={<FormattedMessage id="ui-invoice.invoice.details.vendor.title" />}
          id={SECTIONS_INVOICE.VENDOR_DETAILS}
        >
          <VendorDetails
            vendorInvoiceNo={vendorInvoiceNo}
            vendorId={invoice.vendorId}
            accountingCode={invoice.accountingCode}
          />
        </Accordion>
        {showVoucherInformation && <VoucherInformationContainer invoiceId={invoice.id} />}
        <Accordion
          label={<FormattedMessage id="ui-invoice.linksAndDocuments" />}
          id={SECTIONS_INVOICE.DOCUMENTS}
        >
          <DocumentsDetails />
        </Accordion>

      </AccordionSet>
      {showConfirmDelete && (
        <ConfirmationModal
          id="delete-invoice-confirmation"
          confirmLabel={<FormattedMessage id="ui-invoice.invoice.delete.confirmLabel" />}
          heading={<FormattedMessage id="ui-invoice.invoice.delete.heading" values={{ vendorInvoiceNo }} />}
          message={<FormattedMessage id="ui-invoice.invoice.delete.message" />}
          onCancel={toggleDeleteConfirmation}
          onConfirm={deleteInvoice}
          open
        />
      )}
    </Pane>
  );
}

InvoiceDetails.propTypes = {
  addLines: PropTypes.func.isRequired,
  createLine: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  invoice: PropTypes.object.isRequired,
  deleteInvoice: PropTypes.func.isRequired,
  totalInvoiceLines: PropTypes.number.isRequired,
  invoiceTotalUnits: PropTypes.number,
  tagsToggle: PropTypes.func.isRequired,
  tagsEnabled: PropTypes.bool,
};

InvoiceDetails.defaultProps = {
  invoiceTotalUnits: 0,
  tagsEnabled: false,
};

export default InvoiceDetails;
