import invert from 'lodash/invert';
import { FormattedMessage } from 'react-intl';

import {
  AmountWithCurrencyField,
  PAYMENT_STATUS,
  ORDER_STATUS_LABEL,
  RECEIPT_STATUS,
} from '@folio/stripes-acq-components';
import {
  Icon,
  NoValue,
} from '@folio/stripes/components';

export const buildQueryByIds = (itemsChunk) => {
  const query = itemsChunk
    .map(id => `id==${id}`)
    .join(' or ');

  return query || '';
};

const COLUMN_LINE_NUMBER = 'lineNumber';

export const getResultsFormatter = ({
  orderLinesMap = {},
  currency,
  vendorsMap = {},
  ordersMap = {},
}) => {
  return {
    [COLUMN_LINE_NUMBER]: line => {
      const { poLineId, invoiceLineNumber, id } = line;
      const poLineIsFullyPaid = orderLinesMap?.[poLineId]?.paymentStatus === PAYMENT_STATUS.fullyPaid;

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
    subTotal: ({ subTotal }) => (
      <AmountWithCurrencyField
        amount={subTotal}
        currency={currency}
      />
    ),
    polNumber: line => orderLinesMap?.[line?.poLineId]?.poLineNumber,
    fundCode: line => line.fundDistributions?.map(({ code }) => code)?.join(', ') || <NoValue />,
    poStatus: line => {
      const orderLine = orderLinesMap?.[line.poLineId];

      return ORDER_STATUS_LABEL[ordersMap[orderLine?.purchaseOrderId]?.workflowStatus] || <NoValue />;
    },
    receiptStatus: line => {
      const status = orderLinesMap?.[line.poLineId]?.receiptStatus;
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
    paymentStatus: line => {
      const status = orderLinesMap?.[line.poLineId]?.paymentStatus;
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
    vendorCode: line => {
      const orderLine = orderLinesMap?.[line.poLineId];
      const vendorId = ordersMap[orderLine?.purchaseOrderId]?.vendor;

      return vendorsMap[vendorId]?.code || <NoValue />;
    },
    vendorRefNo: line => (
      line.referenceNumbers?.map(({ refNumber }) => refNumber)?.join(', ') || <NoValue />
    ),
  };
};
