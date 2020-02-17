import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { MultiColumnList } from '@folio/stripes/components';
import { AmountWithCurrencyField } from '@folio/stripes-acq-components';

import styles from './InvoiceLines.css';

const visibleColumns = ['description', 'invoiceLineNumber', 'quantity', 'adjustmentsTotal', 'total'];
const columnMapping = {
  description: <FormattedMessage id="ui-invoice.invoice.details.lines.list.description" />,
  invoiceLineNumber: <FormattedMessage id="ui-invoice.invoice.details.lines.list.number" />,
  quantity: <FormattedMessage id="ui-invoice.invoice.details.lines.list.quantity" />,
  adjustmentsTotal: <FormattedMessage id="ui-invoice.invoice.details.lines.list.adjustments" />,
  total: <FormattedMessage id="ui-invoice.invoice.details.lines.list.total" />,
};

const InvoiceLines = ({
  currency,
  invoiceLinesItems,
  openLineDetails,
}) => {
  const resultsFormatter = {
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
  };

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
      />
    </>
  );
};

InvoiceLines.propTypes = {
  currency: PropTypes.string.isRequired,
  invoiceLinesItems: PropTypes.arrayOf(PropTypes.object),
  openLineDetails: PropTypes.func.isRequired,
};

InvoiceLines.defaultProps = {
  invoiceLinesItems: [],
};

export default InvoiceLines;
