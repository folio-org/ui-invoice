import React, { useMemo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { invert } from 'lodash';
import { useLocation } from 'react-router-dom';

import {
  Icon,
  NoValue,
} from '@folio/stripes/components';
import {
  AmountWithCurrencyField,
  PAYMENT_STATUS,
  FrontendSortingMCL,
  ORDER_STATUS_LABEL,
  RECEIPT_STATUS,
} from '@folio/stripes-acq-components';

import { INVOICE_LINES_COLUMN_MAPPING } from '../../constants';
import { InvoiceLineOrderLineNumber } from './InvoiceLineOrderLineNumber';
import { InvoiceLineOrderLineLink } from './InvoiceLineOrderLineLink';
import styles from './InvoiceLines.css';

const COLUMN_LINE_NUMBER = 'lineNumber';

const sorters = {
  [COLUMN_LINE_NUMBER]: ({ invoiceLineNumber }) => Number(invoiceLineNumber),
};

const InvoiceLines = ({
  invoice,
  vendor,
  orders,
  invoiceLinesItems,
  openLineDetails,
  orderlinesMap,
  refreshData,
  visibleColumns,
}) => {
  const [invoiceLine, setInvoiceLine] = useState();
  const { state } = useLocation();
  const currency = invoice.currency;

  useEffect(() => {
    if (state?.id) {
      const el = document.getElementById(state.id);

      el?.focus();
      el?.scrollIntoView();
    }
  }, [state?.id]);

  const ordersMap = useMemo(() => {
    return orders.reduce((acc, order) => {
      acc[order.id] = order;

      return acc;
    }, {});
  }, [orders]);
  const resultsFormatter = useMemo(() => ({
    // eslint-disable-next-line react/prop-types
    [COLUMN_LINE_NUMBER]: ({ poLineId, invoiceLineNumber, id }) => {
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
          <span id={id}>{invoiceLineNumber}</span>
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
    polNumber: ({ rowIndex, ...line }) => (
      <InvoiceLineOrderLineNumber
        invoiceLine={line}
        poLineNumber={orderlinesMap?.[line.poLineId]?.poLineNumber}
        link={setInvoiceLine}
      />
    ),
    fundCode: line => line.fundDistributions?.map(({ code }) => code)?.join(', ') || <NoValue />,
    poStatus: line => {
      const orderLine = orderlinesMap?.[line.poLineId];

      return ORDER_STATUS_LABEL[ordersMap[orderLine?.purchaseOrderId]?.workflowStatus] || <NoValue />;
    },
    receiptStatus: line => {
      const status = orderlinesMap?.[line.poLineId]?.receiptStatus;
      const translationKey = invert(RECEIPT_STATUS)[status];

      return (
        <FormattedMessage
          id={`ui-orders.receipt_status.${translationKey}`}
          defaultMessage={status}
        />
      );
    },
    paymentStatus: line => {
      const status = orderlinesMap?.[line.poLineId]?.paymentStatus;
      const translationKey = invert(PAYMENT_STATUS)[status];

      return (
        <FormattedMessage
          id={`ui-orders.payment_status.${translationKey}`}
          defaultMessage={status}
        />
      );
    },
    vendorCode: line => {
      const orderLine = orderlinesMap?.[line.poLineId];

      return ordersMap[orderLine?.purchaseOrderId]?.vendor?.code || <NoValue />;
    },
    vendorRefNo: line => (
      line.referenceNumbers?.map(({ refNumber }) => refNumber)?.join(', ') || <NoValue />
    ),
  }), [currency, ordersMap, orderlinesMap]);

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
        columnMapping={INVOICE_LINES_COLUMN_MAPPING}
        onRowClick={openLineDetails}
        formatter={resultsFormatter}
        hasArrow
        sortedColumn={COLUMN_LINE_NUMBER}
        sorters={sorters}
      />

      <InvoiceLineOrderLineLink
        invoice={invoice}
        invoiceLine={invoiceLine}
        vendor={vendor}
        refreshData={refreshData}
      />
    </>
  );
};

InvoiceLines.propTypes = {
  invoice: PropTypes.object.isRequired,
  vendor: PropTypes.object.isRequired,
  orders: PropTypes.arrayOf(PropTypes.object),
  invoiceLinesItems: PropTypes.arrayOf(PropTypes.object),
  openLineDetails: PropTypes.func.isRequired,
  orderlinesMap: PropTypes.object,
  refreshData: PropTypes.func.isRequired,
  visibleColumns: PropTypes.arrayOf(PropTypes.string),
};

InvoiceLines.defaultProps = {
  orders: [],
  invoiceLinesItems: [],
};

export default InvoiceLines;
