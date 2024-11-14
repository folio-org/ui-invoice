import PropTypes from 'prop-types';
import { useRef } from 'react';
import { FormattedMessage } from 'react-intl';
import { useHistory } from 'react-router';

import { useStripes } from '@folio/stripes/core';
import {
  Accordion,
  AccordionSet,
  AccordionStatus,
  checkScope,
  Col,
  collapseAllSections,
  ExpandAllButton,
  expandAllSections,
  HasCommand,
  Row,
} from '@folio/stripes/components';
import { VersionHistoryViewInformation } from './VersionHistoryViewInformation';

export function VersionHistoryView({ version = {} }) {
  const accordionStatusRef = useRef();

  const shortcuts = [
    {
      name: 'expandAllSections',
      handler: (e) => expandAllSections(e, accordionStatusRef),
    },
    {
      name: 'collapseAllSections',
      handler: (e) => collapseAllSections(e, accordionStatusRef),
    },
  ];

  // const { toggleColumn, visibleColumns } = useColumnManager(
  //   'invoice-lines-column-manager',
  //   INVOICE_LINES_COLUMN_MAPPING,
  // );

  // const renderLinesActions = (
  //   <InvoiceLinesActions
  //     createLine={createLine}
  //     addLines={addLines}
  //     isDisabled={IS_EDIT_POST_APPROVAL(invoiceId, status)}
  //     invoiceCurrency={currency}
  //     invoiceVendorId={invoice.vendorId}
  //     toggleColumn={toggleColumn}
  //     visibleColumns={visibleColumns}
  //   />
  // );

  // const vendorInvoiceNo = invoice.vendorInvoiceNo;
  // const adjustments = get(invoice, 'adjustments', []);
  // const fundDistributions = useMemo(
  //   () => adjustments.reduce((acc, adjustment) => {
  //     if (adjustment.fundDistributions) {
  //       adjustment.fundDistributions.forEach((distr) => {
  //         acc.push({
  //           ...distr,
  //           adjustmentDescription: adjustment.description,
  //           adjustmentId: adjustment.id,
  //           totalAmount: calculateAdjustmentAmount(adjustment, subTotal, currency),
  //         });
  //       });
  //     }

  //     return acc;
  //   }, []),
  //   [adjustments, currency, subTotal],
  // );

  return (
    <HasCommand
      commands={shortcuts}
      isWithinScope={checkScope}
      scope={document.body}
    >
      <AccordionStatus ref={accordionStatusRef}>
        <Row end="xs">
          <Col xs={2}>
            <ExpandAllButton />
          </Col>
        </Row>
        <AccordionSet
          id="invoice-details-accordion-set"
        >
          <Accordion
            label={<FormattedMessage id="ui-invoice.invoice.details.information.title" />}
            id="information"
          >
            <VersionHistoryViewInformation
              version={version}
            />
          </Accordion>
          {/* <Accordion
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
          </Accordion> */}

          {/* {Boolean(fundDistributions.length) && (
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
          )} */}

          {/* {Boolean(adjustments.length) && (
          <Accordion
            label={<FormattedMessage id="ui-invoice.invoice.details.accordion.adjustments" />}
            id={SECTIONS.adjustments}
          >
            <AdjustmentsDetails
              adjustments={adjustments}
              currency={currency}
            />
          </Accordion>
          )} */}

          {/* <Accordion
            label={<FormattedMessage id="ui-invoice.invoice.details.vendor.title" />}
            id={SECTIONS.vendorDetails}
          >
            <VendorDetails
              vendorInvoiceNo={vendorInvoiceNo}
              vendor={vendor}
              accountingCode={invoice.accountingCode}
            />
          </Accordion> */}
          {/* <Accordion
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
          </Accordion> */}
          {/* {showVoucherInformation && batchVoucherExport && (
          <Accordion
            label={<FormattedMessage id="ui-invoice.invoice.details.batchVoucherExport.title" />}
            id={SECTIONS.batchVoucherExport}
          >
            <InvoiceBatchVoucherExport
              batchVoucherExport={batchVoucherExport}
              exportFormat={exportFormat}
            />
          </Accordion>
          )} */}
          {/* {showVoucherInformation && <VoucherInformationContainer invoiceId={invoiceId} />}
          <Accordion
            label={<FormattedMessage id="ui-invoice.linksAndDocuments" />}
            id={SECTIONS.documents}
          >
            <DocumentsDetails />
          </Accordion> */}
        </AccordionSet>
      </AccordionStatus>
    </HasCommand>
  );
}

VersionHistoryView.propTypes = {
  version: PropTypes.object,
};
