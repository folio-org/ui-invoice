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
} from '@folio/stripes/components';
import {
  FundDistributionView,
  useModalToggle,
  useAccordionToggle,
  TagsBadge,
  TagsPane,
} from '@folio/stripes-acq-components';

import {
  calculateAdjustmentAmount,
  IS_EDIT_POST_APPROVAL,
} from '../../common/utils';
import { INVOICE_STATUS } from '../../common/constants';
import {
  SECTIONS_INVOICE,
} from '../constants';
import InvoiceActions from './InvoiceActions';
import Information from './Information';
import InvoiceLinesContainer, { InvoiceLinesActions } from './InvoiceLines';
import VendorDetails from './VendorDetails';
import VoucherInformationContainer from './VoucherInformation';
import DocumentsDetails from './DocumentsDetails';
import AdjustmentsDetails from '../AdjustmentsDetails';
import styles from './InvoiceDetails.css';

function InvoiceDetails({
  addLines,
  approveAndPayInvoice,
  approveInvoice,
  createLine,
  deleteInvoice,
  invoice,
  invoiceLines,
  invoiceTotalUnits,
  isApprovePayEnabled,
  onClose,
  onEdit,
  onUpdate,
  payInvoice,
  totalInvoiceLines,
}) {
  const [showConfirmDelete, toggleDeleteConfirmation] = useModalToggle();
  const [isApproveConfirmationOpen, toggleApproveConfirmation] = useModalToggle();
  const [isPayConfirmationOpen, togglePayConfirmation] = useModalToggle();
  const [isApproveAndPayConfirmationOpen, toggleApproveAndPayConfirmation] = useModalToggle();
  const [isTagsOpened, toggleTagsPane] = useModalToggle();
  const [expandAll, sections, toggleSection] = useAccordionToggle({
    [SECTIONS_INVOICE.DOCUMENTS]: false,
  });

  // eslint-disable-next-line react/prop-types
  const renderActionMenu = ({ onToggle }) => {
    return (
      <InvoiceActions
        invoiceLinesCount={totalInvoiceLines}
        invoice={invoice}
        onEdit={() => {
          onToggle();
          onEdit();
        }}
        onDelete={() => {
          onToggle();
          toggleDeleteConfirmation();
        }}
        onApprove={() => {
          onToggle();
          toggleApproveConfirmation();
        }}
        onPay={() => {
          onToggle();
          togglePayConfirmation();
        }}
        onApproveAndPay={() => {
          onToggle();
          toggleApproveAndPayConfirmation();
        }}
        isApprovePayEnabled={isApprovePayEnabled}
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
  const adjustments = get(invoice, 'adjustments', []);
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
      <TagsBadge
        tagsQuantity={tags.length}
        tagsToggle={toggleTagsPane}
      />
    </PaneMenu>
  );

  return (
    <>
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
            <InvoiceLinesContainer
              currency={invoice.currency}
              invoiceLines={invoiceLines}
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
        {
          isApproveConfirmationOpen && (
            <ConfirmationModal
              id="approve-invoice-confirmation"
              heading={<FormattedMessage id="ui-invoice.invoice.actions.approve.confirmation.heading" />}
              message={<FormattedMessage id="ui-invoice.invoice.actions.approve.confirmation.message" />}
              onCancel={toggleApproveConfirmation}
              onConfirm={() => {
                toggleApproveConfirmation();
                approveInvoice();
              }}
              open
            />
          )
        }
        {
          isPayConfirmationOpen && (
            <ConfirmationModal
              id="pay-invoice-confirmation"
              heading={<FormattedMessage id="ui-invoice.invoice.actions.pay.confirmation.heading" />}
              message={<FormattedMessage id="ui-invoice.invoice.actions.pay.confirmation.message" />}
              onCancel={togglePayConfirmation}
              onConfirm={() => {
                togglePayConfirmation();
                payInvoice();
              }}
              open
            />
          )
        }
        {
          isApproveAndPayConfirmationOpen && (
            <ConfirmationModal
              id="approve-pay-invoice-confirmation"
              heading={<FormattedMessage id="ui-invoice.invoice.actions.approveAndPay.confirmation.heading" />}
              message={<FormattedMessage id="ui-invoice.invoice.actions.approveAndPay.confirmation.message" />}
              onCancel={toggleApproveAndPayConfirmation}
              onConfirm={() => {
                toggleApproveAndPayConfirmation();
                approveAndPayInvoice();
              }}
              open
            />
          )
        }
      </Pane>
      {
        isTagsOpened && (
          <TagsPane
            onClose={toggleTagsPane}
            entity={invoice}
            updateEntity={onUpdate}
          />
        )
      }
    </>
  );
}

InvoiceDetails.propTypes = {
  addLines: PropTypes.func.isRequired,
  approveAndPayInvoice: PropTypes.func.isRequired,
  approveInvoice: PropTypes.func.isRequired,
  createLine: PropTypes.func.isRequired,
  deleteInvoice: PropTypes.func.isRequired,
  invoice: PropTypes.object.isRequired,
  invoiceLines: PropTypes.arrayOf(PropTypes.object),
  invoiceTotalUnits: PropTypes.number,
  isApprovePayEnabled: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  payInvoice: PropTypes.func.isRequired,
  totalInvoiceLines: PropTypes.number.isRequired,
};

InvoiceDetails.defaultProps = {
  invoiceTotalUnits: 0,
  isApprovePayEnabled: false,
  invoiceLines: [],
};

export default InvoiceDetails;
