import invert from 'lodash/invert';
import PropTypes from 'prop-types';
import {
  useMemo,
  useState,
  useEffect,
} from 'react';
import { FormattedMessage } from 'react-intl';
import { useLocation } from 'react-router-dom';

import {
  Checkbox,
  Icon,
  NoValue,
} from '@folio/stripes/components';
import { useStripes } from '@folio/stripes/core';
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

const DEFAULT_PROPS = {
  orders: [],
  invoiceLinesItems: [],
};

const InvoiceLines = ({
  exchangedTotalsMap,
  invoice,
  invoiceLinesItems = DEFAULT_PROPS.invoiceLinesItems,
  openLineDetails,
  orderlinesMap,
  orders = DEFAULT_PROPS.orders,
  refreshData,
  vendor,
  visibleColumns,
}) => {
  const { state } = useLocation();

  const stripes = useStripes();

  const [invoiceLine, setInvoiceLine] = useState();
  const currency = invoice.currency;

  const sorters = useMemo(() => ({
    [COLUMN_LINE_NUMBER]: ({ invoiceLineNumber }) => Number(invoiceLineNumber),
    polNumber: ({ poLineId }) => Number(orderlinesMap?.[poLineId]?.poLineNumber?.replace('-', '.')),
    description: ({ description }) => description,
  }), [orderlinesMap]);

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

  /* eslint-disable react/prop-types */
  const resultsFormatter = useMemo(() => ({
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
    adjustmentsTotal: ({ adjustmentsTotal }) => (
      <AmountWithCurrencyField
        amount={adjustmentsTotal}
        currency={currency}
      />
    ),
    total: ({ total }) => (
      <AmountWithCurrencyField
        amount={total}
        currency={currency}
      />
    ),
    totalExchanged: ({ id }) => (
      <AmountWithCurrencyField
        amount={exchangedTotalsMap.get(id)?.calculation}
        currency={stripes.currency}
      />
    ),
    subTotal: ({ subTotal }) => (
      <AmountWithCurrencyField
        amount={subTotal}
        currency={currency}
      />
    ),
    polNumber: ({ poLineId, ...line }) => (
      <InvoiceLineOrderLineNumber
        invoiceLine={line}
        poLineNumber={orderlinesMap?.[poLineId]?.poLineNumber}
        link={setInvoiceLine}
      />
    ),
    fundCode: (line) => line.fundDistributions?.map(({ code }) => code)?.join(', ') || <NoValue />,
    poStatus: ({ poLineId }) => {
      const orderLine = orderlinesMap?.[poLineId];

      return ORDER_STATUS_LABEL[ordersMap[orderLine?.purchaseOrderId]?.workflowStatus] || <NoValue />;
    },
    receiptStatus: ({ poLineId }) => {
      const status = orderlinesMap?.[poLineId]?.receiptStatus;
      const translationKey = invert(RECEIPT_STATUS)[status];

      return status ?
        (
          <FormattedMessage
            id={`ui-orders.receipt_status.${translationKey}`}
            defaultMessage={status}
          />
        )
        : <NoValue />;
    },
    paymentStatus: ({ poLineId }) => {
      const status = orderlinesMap?.[poLineId]?.paymentStatus;
      const translationKey = invert(PAYMENT_STATUS)[status];

      return status ?
        (
          <FormattedMessage
            id={`ui-orders.payment_status.${translationKey}`}
            defaultMessage={status}
          />
        )
        : <NoValue />;
    },
    releaseEncumbrance: ({ releaseEncumbrance }) => (
      <Checkbox
        checked={!!releaseEncumbrance}
        disabled
        type="checkbox"
      />
    ),
    vendorCode: ({ poLineId }) => {
      const orderLine = orderlinesMap?.[poLineId];

      return ordersMap[orderLine?.purchaseOrderId]?.vendor?.code || vendor.code;
    },
    vendorRefNo: ({ referenceNumbers }) => (
      referenceNumbers?.map(({ refNumber }) => refNumber)?.join(', ') || <NoValue />
    ),
  }), [orderlinesMap, currency, exchangedTotalsMap, stripes.currency, ordersMap, vendor.code]);

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
  exchangedTotalsMap: PropTypes.instanceOf(Map).isRequired,
  invoice: PropTypes.object.isRequired,
  invoiceLinesItems: PropTypes.arrayOf(PropTypes.object),
  openLineDetails: PropTypes.func.isRequired,
  orderlinesMap: PropTypes.object,
  orders: PropTypes.arrayOf(PropTypes.object),
  refreshData: PropTypes.func.isRequired,
  vendor: PropTypes.object.isRequired,
  visibleColumns: PropTypes.arrayOf(PropTypes.string),
};

export default InvoiceLines;
