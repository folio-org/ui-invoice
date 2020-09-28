import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Icon,
  MultiColumnList,
  NoValue,
} from '@folio/stripes/components';
import {
  acqRowFormatter,
  AmountWithCurrencyField,
  PAYMENT_STATUS,
} from '@folio/stripes-acq-components';

import styles from './InvoiceLines.css';

const visibleColumns = [
  'lineNumber',
  'polNumber',
  'description',
  'fundCode',
  'quantity',
  'subTotal',
  'adjustmentsTotal',
  'total',
  'vendorRefNo',
  'arrow',
];
const columnMapping = {
  arrow: null,
  description: <FormattedMessage id="ui-invoice.invoice.details.lines.list.description" />,
  quantity: <FormattedMessage id="ui-invoice.invoice.details.lines.list.quantity" />,
  adjustmentsTotal: <FormattedMessage id="ui-invoice.invoice.details.lines.list.adjustments" />,
  total: <FormattedMessage id="ui-invoice.invoice.details.lines.list.total" />,
  lineNumber: <FormattedMessage id="ui-invoice.invoice.details.lines.list.lineNumber" />,
  polNumber: <FormattedMessage id="ui-invoice.invoice.details.lines.list.polNumber" />,
  fundCode: <FormattedMessage id="ui-invoice.invoice.details.lines.list.fundCode" />,
  subTotal: <FormattedMessage id="ui-invoice.invoice.details.lines.list.subTotal" />,
  vendorRefNo: <FormattedMessage id="ui-invoice.invoice.details.lines.list.vendorRefNo" />,
};
const alignRowProps = { alignLastColToEnd: true };

const InvoiceLines = ({
  currency,
  invoiceLinesItems,
  openLineDetails,
  orderlinesMap,
}) => {
  const resultsFormatter = useMemo(() => ({
    // eslint-disable-next-line react/prop-types
    lineNumber: ({ poLineId, rowIndex }) => {
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
          {rowIndex + 1}
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
    arrow: () => <Icon icon="caret-right" />,
    polNumber: ({ poLineId }) => orderlinesMap?.[poLineId]?.poLineNumber || <NoValue />,
    fundCode: ({ fundDistributions }) => fundDistributions?.map(({ code }) => code)?.join(', ') || <NoValue />,
    vendorRefNo: ({ vendorRefNo }) => vendorRefNo || <NoValue />,
  }), [currency, orderlinesMap]);

  return (
    <>
      <div className={styles.invoiceLinesTotal}>
        <FormattedMessage
          id="ui-invoice.invoiceLine.total"
          values={{ total: invoiceLinesItems.length }}
        />
      </div>

      <MultiColumnList
        id="invoice-lines-list"
        contentData={invoiceLinesItems}
        visibleColumns={visibleColumns}
        columnMapping={columnMapping}
        onRowClick={openLineDetails}
        formatter={resultsFormatter}
        rowFormatter={acqRowFormatter}
        rowProps={alignRowProps}
      />
    </>
  );
};

InvoiceLines.propTypes = {
  currency: PropTypes.string.isRequired,
  invoiceLinesItems: PropTypes.arrayOf(PropTypes.object),
  openLineDetails: PropTypes.func.isRequired,
  orderlinesMap: PropTypes.object,
};

InvoiceLines.defaultProps = {
  invoiceLinesItems: [],
};

export default InvoiceLines;
