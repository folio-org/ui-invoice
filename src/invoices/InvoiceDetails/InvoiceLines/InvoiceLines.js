import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Icon,
  NoValue,
} from '@folio/stripes/components';
import {
  AmountWithCurrencyField,
  PAYMENT_STATUS,
  FrontendSortingMCL,
} from '@folio/stripes-acq-components';

import { InvoiceLinePOLineNumber } from './InvoiceLinePOLineNumber';
import styles from './InvoiceLines.css';

const COLUMN_LINE_NUMBER = 'lineNumber';
const visibleColumns = [
  COLUMN_LINE_NUMBER,
  'polNumber',
  'description',
  'fundCode',
  'quantity',
  'subTotal',
  'adjustmentsTotal',
  'total',
  'vendorRefNo',
];
const columnMapping = {
  description: <FormattedMessage id="ui-invoice.invoice.details.lines.list.description" />,
  quantity: <FormattedMessage id="ui-invoice.invoice.details.lines.list.quantity" />,
  adjustmentsTotal: <FormattedMessage id="ui-invoice.invoice.details.lines.list.adjustments" />,
  total: <FormattedMessage id="ui-invoice.invoice.details.lines.list.total" />,
  [COLUMN_LINE_NUMBER]: <FormattedMessage id="ui-invoice.invoice.details.lines.list.lineNumber" />,
  polNumber: <FormattedMessage id="ui-invoice.invoice.details.lines.list.polNumber" />,
  fundCode: <FormattedMessage id="ui-invoice.invoice.details.lines.list.fundCode" />,
  subTotal: <FormattedMessage id="ui-invoice.invoice.details.lines.list.subTotal" />,
  vendorRefNo: <FormattedMessage id="ui-invoice.invoice.details.lines.list.vendorRefNumber" />,
};

const sorters = {
  [COLUMN_LINE_NUMBER]: ({ invoiceLineNumber }) => Number(invoiceLineNumber),
};

const InvoiceLines = ({
  invoice,
  vendor,
  invoiceLinesItems,
  openLineDetails,
  orderlinesMap,
  refreshData,
}) => {
  const currency = invoice.currency;

  const resultsFormatter = useMemo(() => ({
    // eslint-disable-next-line react/prop-types
    [COLUMN_LINE_NUMBER]: ({ poLineId, invoiceLineNumber }) => {
      const poLineIsFullyPaid = orderlinesMap?.[poLineId]?.paymentStatus === PAYMENT_STATUS.fullyPaid;

      return (
        <>
          {!poLineIsFullyPaid ? null : (
            <>
              <Icon
                data-test-line-is-fully-paid-icon
                icon="exclamation-circle"
                size="medium"
                status="warn"
              />
              &nbsp;
            </>
          )}
          {invoiceLineNumber}
        </>
      );
    },
    // eslint-disable-next-line react/prop-types
    adjustmentsTotal: ({ adjustmentsTotal }) => (
      <AmountWithCurrencyField
        amount={adjustmentsTotal}
        currency={currency}
      />
    ),
    // eslint-disable-next-line react/prop-types
    total: ({ total }) => (
      <AmountWithCurrencyField
        amount={total}
        currency={currency}
      />
    ),
    // eslint-disable-next-line react/prop-types
    subTotal: ({ subTotal }) => (
      <AmountWithCurrencyField
        amount={subTotal}
        currency={currency}
      />
    ),
    // eslint-disable-next-line
    polNumber: ({ rowIndex, ...invoiceLine }) => (
      <InvoiceLinePOLineNumber
        invoice={invoice}
        vendor={vendor}
        invoiceLine={invoiceLine}
        poLineNumber={orderlinesMap?.[invoiceLine.poLineId]?.poLineNumber}
        refreshData={refreshData}
      />
    ),
    fundCode: ({ fundDistributions }) => fundDistributions?.map(({ code }) => code)?.join(', ') || <NoValue />,
    vendorRefNo: line => (
      line.referenceNumbers?.map(({ refNumber }) => refNumber)?.join(', ') || <NoValue />
    ),
  }), [invoice, vendor, currency, orderlinesMap, refreshData]);

  return (
    <>
      <div className={styles.invoiceLinesTotal}>
        <FormattedMessage
          id="ui-invoice.invoiceLine.total"
          values={{ total: invoiceLinesItems.length }}
        />
      </div>

      <FrontendSortingMCL
        id="invoice-lines-list"
        contentData={invoiceLinesItems}
        visibleColumns={visibleColumns}
        columnMapping={columnMapping}
        onRowClick={openLineDetails}
        formatter={resultsFormatter}
        hasArrow
        sortedColumn={COLUMN_LINE_NUMBER}
        sorters={sorters}
      />
    </>
  );
};

InvoiceLines.propTypes = {
  invoice: PropTypes.object.isRequired,
  vendor: PropTypes.object.isRequired,
  invoiceLinesItems: PropTypes.arrayOf(PropTypes.object),
  openLineDetails: PropTypes.func.isRequired,
  orderlinesMap: PropTypes.object,
  refreshData: PropTypes.func.isRequired,
};

InvoiceLines.defaultProps = {
  invoiceLinesItems: [],
};

export default InvoiceLines;
