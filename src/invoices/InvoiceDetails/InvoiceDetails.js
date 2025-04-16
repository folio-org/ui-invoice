import get from 'lodash/get';
import PropTypes from 'prop-types';
import {
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import { FormattedMessage } from 'react-intl';
import {
  useHistory,
  useLocation,
} from 'react-router-dom';

import {
  TitleManager,
  useStripes,
} from '@folio/stripes/core';
import {
  Accordion,
  AccordionSet,
  AccordionStatus,
  checkScope,
  Col,
  collapseAllSections,
  ConfirmationModal,
  ExpandAllButton,
  expandAllSections,
  HasCommand,
  MessageBanner,
  Pane,
  PaneMenu,
  Row,
} from '@folio/stripes/components';
import { useColumnManager } from '@folio/stripes/smart-components';
import {
  FundDistributionView,
  handleKeyCommand,
  PAYMENT_STATUS,
  useModalToggle,
  TagsBadge,
  TagsPane,
  useAcqRestrictions,
  VersionHistoryButton,
} from '@folio/stripes-acq-components';

import {
  INVOICE_ROUTE,
  INVOICE_STATUS,
} from '../../common/constants';
import {
  calculateAdjustmentAmount,
  IS_EDIT_POST_APPROVAL,
} from '../../common/utils';
import {
  INVOICE_LINES_COLUMN_MAPPING,
  SECTIONS_INVOICE as SECTIONS,
} from '../constants';
import AdjustmentsDetails from '../AdjustmentsDetails';
import { PrintVoucherContainer } from '../PrintVoucher';
import ApproveConfirmationModal from './ApproveConfirmationModal';
import CancellationModal from './CancellationModal';
import { VENDOR_STATUS } from './constants';
import DocumentsDetails from './DocumentsDetails';
import ExtendedInformation from './ExtendedInformation';
import { useHasPendingOrders } from './hooks';
import Information from './Information';
import InvoiceActions from './InvoiceActions';
import InvoiceBatchVoucherExport from './InvoiceBatchVoucherExport';
import InvoiceLinesContainer, { InvoiceLinesActions } from './InvoiceLines';
import UpdateOrderStatusModal from './UpdateOrderStatusModal';
import VendorDetails from './VendorDetails';
import VoucherInformationContainer from './VoucherInformation';

import styles from './InvoiceDetails.css';

const initalAccordionsStatus = {
  [SECTIONS.documents]: false,
  [SECTIONS.extendedInformation]: false,
};

function InvoiceDetails({
  addLines,
  approveAndPayInvoice,
  approveInvoice,
  cancelInvoice,
  createLine,
  deleteInvoice,
  onDuplicateInvoice,
  invoice,
  invoiceLines,
  invoiceTotalUnits,
  vendor,
  isApprovePayEnabled,
  shouldUpdateOrderStatus,
  onClose,
  onEdit,
  orderlinesMap,
  onUpdate,
  payInvoice,
  totalInvoiceLines,
  batchVoucherExport,
  exportFormat,
  refreshData,
}) {
  const history = useHistory();
  const stripes = useStripes();
  const { search } = useLocation();
  const accordionStatusRef = useRef();

  const {
    acqUnitIds,
    currency,
    exchangeRate,
    id: invoiceId,
    status,
    subTotal,
  } = invoice || {};

  const { restrictions, isLoading: isRestrictionsLoading } = useAcqRestrictions(invoiceId, acqUnitIds);
  const { hasPendingOrders, isLoading: isPendingOrdersLoading } = useHasPendingOrders(orderlinesMap);
  const isVendorInactive = vendor?.status === VENDOR_STATUS.INACTIVE;
  const showHasPendingOrdersMessage = hasPendingOrders && !isPendingOrdersLoading;

  const [cancellationNote, setCancellationNote] = useState('');

  const [showConfirmDelete, toggleDeleteConfirmation] = useModalToggle();
  const [isApproveConfirmationOpen, toggleApproveConfirmation] = useModalToggle();
  const [isPayConfirmationOpen, togglePayConfirmation] = useModalToggle();
  const [isPayAndUpdateOrderStatusModalOpen, togglePayAndUpdateOrderStatusModalOpen] = useModalToggle();
  const [isApproveAndPayConfirmationOpen, toggleApproveAndPayConfirmation] = useModalToggle();
  const [isApprovePayAndUpdateOrderStatusModalOpen, toggleApprovePayAndUpdateOrderStatusModal] = useModalToggle();
  const [isUpdateOrderStatusModalOpen, toggleUpdateOrderStatusModal] = useModalToggle();
  const [isCancellationModalOpen, toggleCancellationModal] = useModalToggle();
  const [isTagsOpened, toggleTagsPane] = useModalToggle();
  const [isPrintModalOpened, togglePrintModal] = useModalToggle();
  const [isDuplicateModalConfirmationOpen, toggleDuplicateModalConfirmation] = useModalToggle();
  const showVoucherInformation = [
    INVOICE_STATUS.approved,
    INVOICE_STATUS.paid,
    INVOICE_STATUS.cancelled,
  ].includes(status);

  const shortcuts = [
    {
      name: 'new',
      handler: handleKeyCommand(() => {
        if (stripes.hasPerm('ui-invoice.invoice.create')) {
          history.push('/invoice/create');
        }
      }),
    },
    {
      name: 'edit',
      handler: handleKeyCommand(() => {
        if (
          stripes.hasPerm('ui-invoice.invoice.edit') &&
          !isRestrictionsLoading &&
          !restrictions.protectUpdate
        ) onEdit();
      }),
    },
    {
      name: 'expandAllSections',
      handler: (e) => expandAllSections(e, accordionStatusRef),
    },
    {
      name: 'collapseAllSections',
      handler: (e) => collapseAllSections(e, accordionStatusRef),
    },
  ];

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
        onDuplicate={() => {
          onToggle();
          toggleDuplicateModalConfirmation();
        }}
        onApprove={() => {
          onToggle();
          toggleApproveConfirmation();
        }}
        onPay={() => {
          onToggle();

          if (shouldUpdateOrderStatus()) {
            togglePayAndUpdateOrderStatusModalOpen();
          } else {
            togglePayConfirmation();
          }
        }}
        onApproveAndPay={() => {
          onToggle();

          if (shouldUpdateOrderStatus()) {
            toggleApprovePayAndUpdateOrderStatusModal();
          } else {
            toggleApproveAndPayConfirmation();
          }
        }}
        onPrint={!showVoucherInformation ? undefined : () => {
          onToggle();
          togglePrintModal();
        }}
        onInvoiceCancel={() => {
          onToggle();
          toggleCancellationModal();
        }}
        isApprovePayAvailable={isApprovePayEnabled}
        isEditDisabled={isRestrictionsLoading || restrictions.protectUpdate}
        isDeleteDisabled={isRestrictionsLoading || restrictions.protectDelete}
        isApprovePayEnabled={!isVendorInactive && !hasPendingOrders && !isPendingOrdersLoading}
      />
    );
  };

  const { toggleColumn, visibleColumns } = useColumnManager(
    'invoice-lines-column-manager',
    INVOICE_LINES_COLUMN_MAPPING,
  );

  const openVersionHistory = useCallback(() => {
    history.push({
      pathname: `${INVOICE_ROUTE}/view/${invoiceId}/versions`,
      search,
    });
  }, [history, search, invoiceId]);

  const renderLinesActions = (
    <InvoiceLinesActions
      createLine={createLine}
      addLines={addLines}
      isDisabled={IS_EDIT_POST_APPROVAL(invoiceId, status)}
      invoiceCurrency={currency}
      invoiceVendorId={invoice.vendorId}
      toggleColumn={toggleColumn}
      visibleColumns={visibleColumns}
    />
  );

  const vendorCode = vendor?.code;
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
            adjustmentId: adjustment.id,
            totalAmount: calculateAdjustmentAmount(adjustment, subTotal, currency),
          });
        });
      }

      return acc;
    }, []),
    [adjustments, currency, subTotal],
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
      <VersionHistoryButton onClick={openVersionHistory} />
    </PaneMenu>
  );
  const hasPOLineIsFullyPaid = orderlinesMap &&
    Object.values(orderlinesMap).some(({ paymentStatus }) => paymentStatus === PAYMENT_STATUS.fullyPaid);

  return (
    <HasCommand
      commands={shortcuts}
      isWithinScope={checkScope}
      scope={document.body}
    >
      <Pane
        id="pane-invoiceDetails"
        defaultWidth="fill"
        dismissible
        onClose={onClose}
        paneTitle={paneTitle}
        paneSub={vendorCode}
        actionMenu={renderActionMenu}
        lastMenu={lastMenu}
      >
        <TitleManager record={vendorInvoiceNo} />
        <AccordionStatus ref={accordionStatusRef}>
          <Row end="xs">
            <Col xs={10}>
              {!hasPOLineIsFullyPaid ? null : (
                <MessageBanner type="warning">
                  <FormattedMessage id="ui-invoice.invoice.details.hasFullyPaidPOLine" />
                </MessageBanner>
              )}
              {showHasPendingOrdersMessage && (
                <MessageBanner type="warning">
                  <FormattedMessage id="ui-invoice.invoice.details.hasPendingOrders" />
                </MessageBanner>
              )}
              {isVendorInactive && (
                <MessageBanner type="warning">
                  <FormattedMessage id="ui-invoice.invoice.details.vendor.inactive" />
                </MessageBanner>
              )}
            </Col>
            <Col xs={2}>
              <ExpandAllButton />
            </Col>
          </Row>
          <AccordionSet
            initialStatus={initalAccordionsStatus}
            id="invoice-details-accordion-set"
          >
            <Accordion
              label={<FormattedMessage id="ui-invoice.invoice.details.information.title" />}
              id={SECTIONS.information}
            >
              <Information
                adjustmentsTotal={invoice.adjustmentsTotal}
                approvalDate={invoice.approvalDate}
                approvedBy={invoice.approvedBy}
                batchGroupId={invoice.batchGroupId}
                exchangeRate={exchangeRate}
                fiscalYearId={invoice.fiscalYearId}
                invoiceDate={invoice.invoiceDate}
                paymentDate={invoice.paymentDate}
                paymentDue={invoice.paymentDue}
                paymentTerms={invoice.paymentTerms}
                status={status}
                subTotal={subTotal}
                total={invoice.total}
                source={invoice.source}
                metadata={invoice.metadata}
                billTo={invoice.billTo}
                invoiceTotalUnits={invoiceTotalUnits}
                acqUnits={acqUnitIds}
                currency={currency}
                note={invoice.note}
                lockTotal={invoice.lockTotal}
                cancellationNote={invoice.cancellationNote}
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
                invoice={invoice}
                invoiceLines={invoiceLines}
                vendor={vendor}
                orderlinesMap={orderlinesMap}
                refreshData={refreshData}
                toggleColumn={toggleColumn}
                visibleColumns={visibleColumns}
              />
            </Accordion>

            {Boolean(fundDistributions.length) && (
              <Accordion
                id={SECTIONS.fundDistribution}
                label={<FormattedMessage id="ui-invoice.invoice.details.accordion.fundDistribution" />}
              >
                <FundDistributionView
                  currency={currency}
                  fundDistributions={fundDistributions}
                  groupBy="adjustmentId"
                />
              </Accordion>
            )}

            {Boolean(adjustments.length) && (
              <Accordion
                label={<FormattedMessage id="ui-invoice.invoice.details.accordion.adjustments" />}
                id={SECTIONS.adjustments}
              >
                <AdjustmentsDetails
                  adjustments={adjustments}
                  currency={currency}
                />
              </Accordion>
            )}

            <Accordion
              label={<FormattedMessage id="ui-invoice.invoice.details.vendor.title" />}
              id={SECTIONS.vendorDetails}
            >
              <VendorDetails
                vendorInvoiceNo={vendorInvoiceNo}
                vendor={vendor}
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
                currency={currency}
                exchangeRate={exchangeRate}
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
            {showVoucherInformation && <VoucherInformationContainer invoiceId={invoiceId} />}
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
          isCancellationModalOpen && (
            <CancellationModal
              onCancel={toggleCancellationModal}
              onConfirm={() => {
                toggleCancellationModal();

                if (shouldUpdateOrderStatus()) {
                  toggleUpdateOrderStatusModal();
                } else {
                  cancelInvoice({ cancellationNote });
                }
              }}
              setCancellationNote={setCancellationNote}
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
          isPayAndUpdateOrderStatusModalOpen && (
            <UpdateOrderStatusModal
              onCancel={togglePayAndUpdateOrderStatusModalOpen}
              onConfirm={(polineStatus) => {
                togglePayAndUpdateOrderStatusModalOpen();
                payInvoice(polineStatus);
              }}
            />
          )
        }
        {
          isDuplicateModalConfirmationOpen && (
            <ConfirmationModal
              id="duplicate-invoice-confirmation"
              confirmLabel={<FormattedMessage id="ui-invoice.invoice.actions.duplicate.confirmLabel" />}
              heading={<FormattedMessage id="ui-invoice.invoice.actions.duplicate.confirmation.heading" />}
              message={<FormattedMessage id="ui-invoice.invoice.actions.duplicate.confirmation.message" />}
              onCancel={toggleDuplicateModalConfirmation}
              onConfirm={() => {
                toggleDuplicateModalConfirmation();
                onDuplicateInvoice();
              }}
              open
            />
          )
        }
        {
          isApproveAndPayConfirmationOpen && (
            <ApproveConfirmationModal
              id="approve-pay-invoice-confirmation"
              headingLabelId="ui-invoice.invoice.actions.approveAndPay.confirmation.heading"
              messageLabelId="ui-invoice.invoice.actions.approveAndPay.confirmation.message"
              onCancel={toggleApproveAndPayConfirmation}
              onConfirm={() => {
                toggleApproveAndPayConfirmation();
                approveAndPayInvoice();
              }}
              invoice={invoice}
            />
          )
        }
        {
          isApprovePayAndUpdateOrderStatusModalOpen && (
            <UpdateOrderStatusModal
              onCancel={toggleApprovePayAndUpdateOrderStatusModal}
              onConfirm={(polineStatus) => {
                toggleApprovePayAndUpdateOrderStatusModal();
                approveAndPayInvoice(polineStatus);
              }}
            />
          )
        }
        {
          isUpdateOrderStatusModalOpen && (
            <UpdateOrderStatusModal
              onCancel={toggleUpdateOrderStatusModal}
              onConfirm={(polineStatus) => {
                toggleUpdateOrderStatusModal();
                cancelInvoice({ cancellationNote, polineStatus });
              }}
            />
          )
        }
        {isPrintModalOpened && (
          <PrintVoucherContainer
            closePrint={togglePrintModal}
            invoice={invoice}
          />
        )}
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
    </HasCommand>
  );
}

InvoiceDetails.propTypes = {
  addLines: PropTypes.func.isRequired,
  approveAndPayInvoice: PropTypes.func.isRequired,
  approveInvoice: PropTypes.func.isRequired,
  cancelInvoice: PropTypes.func.isRequired,
  createLine: PropTypes.func.isRequired,
  deleteInvoice: PropTypes.func.isRequired,
  onDuplicateInvoice: PropTypes.func.isRequired,
  invoice: PropTypes.object.isRequired,
  invoiceLines: PropTypes.arrayOf(PropTypes.object),
  invoiceTotalUnits: PropTypes.number,
  vendor: PropTypes.object,
  isApprovePayEnabled: PropTypes.bool,
  shouldUpdateOrderStatus: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  orderlinesMap: PropTypes.object,
  onUpdate: PropTypes.func.isRequired,
  payInvoice: PropTypes.func.isRequired,
  totalInvoiceLines: PropTypes.number.isRequired,
  batchVoucherExport: PropTypes.object,
  exportFormat: PropTypes.string,
  refreshData: PropTypes.func.isRequired,
};

InvoiceDetails.defaultProps = {
  invoiceTotalUnits: 0,
  isApprovePayEnabled: false,
  invoiceLines: [],
};

export default InvoiceDetails;
