import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';

import {
  Accordion,
  AccordionSet,
  AccordionStatus,
  Col,
  ConfirmationModal,
  ExpandAllButton,
  MessageBanner,
  Pane,
  PaneMenu,
  Row,
} from '@folio/stripes/components';
import {
  FundDistributionView,
  PAYMENT_STATUS,
  useModalToggle,
  TagsBadge,
  TagsPane,
} from '@folio/stripes-acq-components';

import {
  calculateAdjustmentAmount,
  IS_EDIT_POST_APPROVAL,
} from '../../common/utils';
import { INVOICE_STATUS } from '../../common/constants';
import {
  SECTIONS_INVOICE as SECTIONS,
} from '../constants';
import AdjustmentsDetails from '../AdjustmentsDetails';
import InvoiceActions from './InvoiceActions';
import Information from './Information';
import InvoiceLinesContainer, { InvoiceLinesActions } from './InvoiceLines';
import VendorDetails from './VendorDetails';
import VoucherInformationContainer from './VoucherInformation';
import DocumentsDetails from './DocumentsDetails';
import InvoiceBatchVoucherExport from './InvoiceBatchVoucherExport';
import ApproveConfirmationModal from './ApproveConfirmationModal';
import ExtendedInformation from './ExtendedInformation';
import styles from './InvoiceDetails.css';

const initalAccordionsStatus = {
  [SECTIONS.documents]: false,
  [SECTIONS.extendedInformation]: false,
};

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
  orderlinesMap,
  onUpdate,
  payInvoice,
  totalInvoiceLines,
  batchVoucherExport,
  exportFormat,
  vendorName,
}) {
  const [showConfirmDelete, toggleDeleteConfirmation] = useModalToggle();
  const [isApproveConfirmationOpen, toggleApproveConfirmation] = useModalToggle();
  const [isPayConfirmationOpen, togglePayConfirmation] = useModalToggle();
  const [isApproveAndPayConfirmationOpen, toggleApproveAndPayConfirmation] = useModalToggle();
  const [isTagsOpened, toggleTagsPane] = useModalToggle();
  const showVoucherInformation = [INVOICE_STATUS.approved, INVOICE_STATUS.paid].includes(invoice.status);

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
        onPrint={!showVoucherInformation ? undefined : () => {
          onToggle();
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
      invoiceCurrency={invoice.currency}
      invoiceVendorId={invoice.vendorId}
    />
  );

  const vendorInvoiceNo = invoice.vendorInvoiceNo;
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
  const hasPOLineIsFullyPaid = orderlinesMap &&
    Object.values(orderlinesMap).some(({ paymentStatus }) => paymentStatus === PAYMENT_STATUS.fullyPaid);

  return (
    <>
      <Pane
        id="pane-invoiceDetails"
        defaultWidth="fill"
        dismissible
        onClose={onClose}
        paneTitle={paneTitle}
        paneSub={vendorName}
        actionMenu={renderActionMenu}
        lastMenu={lastMenu}
      >
        <AccordionStatus>
          <Row end="xs">
            <Col xs={10}>
              {!hasPOLineIsFullyPaid ? null : (
                <MessageBanner type="warning">
                  <FormattedMessage id="ui-invoice.invoice.details.hasFullyPaidPOLine" />
                </MessageBanner>
              )}
            </Col>
            <Col xs={2}>
              <ExpandAllButton />
            </Col>
          </Row>
          <AccordionSet initialStatus={initalAccordionsStatus}>
            <Accordion
              label={<FormattedMessage id="ui-invoice.invoice.details.information.title" />}
              id={SECTIONS.information}
            >
              <Information
                adjustmentsTotal={invoice.adjustmentsTotal}
                approvalDate={invoice.approvalDate}
                approvedBy={invoice.approvedBy}
                batchGroupId={invoice.batchGroupId}
                invoiceDate={invoice.invoiceDate}
                paymentDate={invoice.paymentDate}
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
                note={invoice.note}
                lockTotal={invoice.lockTotal}
              />
            </Accordion>
            <Accordion
              label={<FormattedMessage id="ui-invoice.invoice.details.lines.title" />}
              id={SECTIONS.lines}
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
                orderlinesMap={orderlinesMap}
              />
            </Accordion>
            <Accordion
              id={SECTIONS.fundDistribution}
              label={<FormattedMessage id="ui-invoice.fundDistribution" />}
            >
              <FundDistributionView
                currency={invoice.currency}
                fundDistributions={fundDistributions}
              />
            </Accordion>
            <Accordion
              label={<FormattedMessage id="ui-invoice.adjustments" />}
              id={SECTIONS.adjustments}
            >
              <AdjustmentsDetails
                adjustments={adjustments}
                currency={invoice.currency}
              />
            </Accordion>
            <Accordion
              label={<FormattedMessage id="ui-invoice.invoice.details.vendor.title" />}
              id={SECTIONS.vendorDetails}
            >
              <VendorDetails
                vendorInvoiceNo={vendorInvoiceNo}
                vendorId={invoice.vendorId}
                accountingCode={invoice.accountingCode}
              />
            </Accordion>
            <Accordion
              label={<FormattedMessage id="ui-invoice.extendedInformation" />}
              id={SECTIONS.extendedInformation}
            >
              <ExtendedInformation
                folioInvoiceNo={invoice.folioInvoiceNo}
                paymentMethod={invoice.paymentMethod}
                chkSubscriptionOverlap={invoice.chkSubscriptionOverlap}
                exportToAccounting={invoice.exportToAccounting}
                currency={invoice.currency}
                exchangeRate={invoice.exchangeRate}
                enclosureNeeded={invoice.enclosureNeeded}
              />
            </Accordion>
            {showVoucherInformation && batchVoucherExport && (
              <Accordion
                label={<FormattedMessage id="ui-invoice.invoice.details.batchVoucherExport.title" />}
                id={SECTIONS.batchVoucherExport}
              >
                <InvoiceBatchVoucherExport
                  batchVoucherExport={batchVoucherExport}
                  exportFormat={exportFormat}
                />
              </Accordion>
            )}
            {showVoucherInformation && <VoucherInformationContainer invoiceId={invoice.id} />}
            <Accordion
              label={<FormattedMessage id="ui-invoice.linksAndDocuments" />}
              id={SECTIONS.documents}
            >
              <DocumentsDetails />
            </Accordion>
          </AccordionSet>
        </AccordionStatus>
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
            <ApproveConfirmationModal
              onCancel={toggleApproveConfirmation}
              onConfirm={() => {
                toggleApproveConfirmation();
                approveInvoice();
              }}
              invoice={invoice}
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
  orderlinesMap: PropTypes.object,
  onUpdate: PropTypes.func.isRequired,
  payInvoice: PropTypes.func.isRequired,
  totalInvoiceLines: PropTypes.number.isRequired,
  batchVoucherExport: PropTypes.object,
  exportFormat: PropTypes.string,
  vendorName: PropTypes.string,
};

InvoiceDetails.defaultProps = {
  invoiceTotalUnits: 0,
  isApprovePayEnabled: false,
  invoiceLines: [],
};

export default InvoiceDetails;
