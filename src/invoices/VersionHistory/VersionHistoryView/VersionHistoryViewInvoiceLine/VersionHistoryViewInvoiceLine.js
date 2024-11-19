import invert from 'lodash/invert';
import keyBy from 'lodash/keyBy';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';

import {
  Icon,
  Loading,
  NoValue,
} from '@folio/stripes/components';
import { useColumnManager } from '@folio/stripes/smart-components';
import {
  AmountWithCurrencyField,
  PAYMENT_STATUS,
  FrontendSortingMCL,
  ORDER_STATUS_LABEL,
  RECEIPT_STATUS,
} from '@folio/stripes-acq-components';

import {
  useOrderLines,
  useVendors,
} from '../../../../common/hooks';
import { INVOICE_LINES_COLUMN_MAPPING } from '../../../constants';
import {
  useInvoiceLinesByInvoiceId,
  useOrdersByPoNumbers,
} from '../hooks';
import { buildQueryByIds } from './utils';

import styles from './style.css';

const COLUMN_LINE_NUMBER = 'lineNumber';

export const VersionHistoryViewInvoiceLine = ({ version = {} }) => {
  const {
    invoiceLines = [],
    isLoading: isInvoiceLinesLoading,
  } = useInvoiceLinesByInvoiceId(version?.id);
  const {
    orders = [],
    isLoading: isOrdersLoading,
  } = useOrdersByPoNumbers(version?.poNumbers);

  const orderLineIds = useMemo(() => invoiceLines.map(({ poLineId }) => poLineId), [invoiceLines]);

  const {
    orderLines,
    isLoading: isOrderLinesLoading,
  } = useOrderLines(orderLineIds, { buildQuery: buildQueryByIds });
  const {
    vendors,
    isLoading: isVendorsLoading,
  } = useVendors(orders.map(({ vendor }) => vendor));

  const currency = version?.currency;

  const orderLinesMap = useMemo(() => keyBy(orderLines, 'id'), [orderLines]);
  const ordersMap = useMemo(() => keyBy(orders, 'id'), [orders]);
  const vendorsMap = useMemo(() => keyBy(vendors, 'id'), [vendors]);

  const { visibleColumns } = useColumnManager(
    'invoice-lines-column-manager',
    INVOICE_LINES_COLUMN_MAPPING,
  );

  const sorters = useMemo(() => ({
    [COLUMN_LINE_NUMBER]: ({ invoiceLineNumber }) => Number(invoiceLineNumber),
    polNumber: ({ poLineId }) => Number(orderLinesMap?.[poLineId]?.poLineNumber?.replace('-', '.')),
    description: ({ description }) => description,
  }), [orderLinesMap]);

  const resultsFormatter = useMemo(() => ({
    // eslint-disable-next-line react/prop-types
    [COLUMN_LINE_NUMBER]: ({ poLineId, invoiceLineNumber, id }) => {
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
    polNumber: ({ rowIndex, ...line }) => orderLinesMap?.[line?.poLineId]?.poLineNumber,
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
  }), [orderLinesMap, currency, ordersMap, vendorsMap]);

  const isLoading = isInvoiceLinesLoading || isOrderLinesLoading || isVendorsLoading || isOrdersLoading;

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <div className={styles.invoiceLinesTotal}>
        <FormattedMessage
          id="ui-invoice.invoiceLine.total"
          values={{ total: invoiceLines.length }}
        />
      </div>

      <FrontendSortingMCL
        id="invoice-lines-list"
        contentData={invoiceLines}
        visibleColumns={visibleColumns}
        columnMapping={INVOICE_LINES_COLUMN_MAPPING}
        formatter={resultsFormatter}
        hasArrow
        sortedColumn={COLUMN_LINE_NUMBER}
        sorters={sorters}
      />
    </>
  );
};

VersionHistoryViewInvoiceLine.propTypes = {
  version: PropTypes.object.isRequired,
};
