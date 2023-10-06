import { find, invert, uniq } from 'lodash';
import { FormattedMessage } from 'react-intl';

import { NoValue } from '@folio/stripes/components';
import {
  AmountWithCurrencyField,
  ORDER_STATUS_LABEL,
  PAYMENT_STATUS,
  RECEIPT_STATUS,
} from '@folio/stripes-acq-components';

import { ACCOUNT_STATUS } from './constants';

const { ACTIVE, INACTIVE } = ACCOUNT_STATUS;

export const getAdjustmentFromPreset = ({
  description,
  prorate,
  relationToTotal,
  type,
  defaultAmount,
  exportToAccounting,
}) => ({
  description,
  prorate,
  relationToTotal,
  type,
  value: defaultAmount,
  exportToAccounting,
});

export const convertToInvoiceLineFields = (orderLine, vendor) => {
  const quantityPhysical = orderLine.cost?.quantityPhysical ?? 0;
  const quantityElectronic = orderLine.cost?.quantityElectronic ?? 0;
  const accountNumber = orderLine.vendorDetail?.vendorAccount;
  const optionalProps = {};

  if (accountNumber) {
    const accounts = vendor?.accounts ?? [];
    const account = find(accounts, { accountNo: accountNumber });
    const accountingCode = account?.appSystemNo || vendor?.erpCode;

    optionalProps.accountNumber = accountNumber;
    if (accountingCode) {
      optionalProps.accountingCode = accountingCode;
    }
  }

  return {
    description: orderLine.titleOrPackage,
    comment: orderLine.poLineDescription,
    fundDistributions: orderLine.fundDistribution,
    referenceNumbers: orderLine.vendorDetail?.referenceNumbers,
    subscriptionStart: orderLine.details?.subscriptionFrom,
    subscriptionEnd: orderLine.details?.subscriptionTo,
    quantity: quantityElectronic + quantityPhysical,
    subTotal: orderLine.cost?.poLineEstimatedPrice ?? 0,
    ...optionalProps,
  };
};

export const getCommonInvoiceLinesFormatter = (currency, ordersMap, orderlinesMap) => ({
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
  fundCode: line => line.fundDistributions?.map(({ code }) => code)?.join(', ') || <NoValue />,
  poStatus: line => {
    const orderLine = orderlinesMap?.[line.poLineId];

    return ORDER_STATUS_LABEL[ordersMap[orderLine?.purchaseOrderId]?.workflowStatus] || <NoValue />;
  },
  receiptStatus: line => {
    const status = orderlinesMap?.[line.poLineId]?.receiptStatus;
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
    const status = orderlinesMap?.[line.poLineId]?.paymentStatus;
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
    const orderLine = orderlinesMap?.[line.poLineId];

    return ordersMap[orderLine?.purchaseOrderId]?.vendor?.code || <NoValue />;
  },
  vendorRefNo: line => (
    line.referenceNumbers?.map(({ refNumber }) => refNumber)?.join(', ') || <NoValue />
  ),
});

export const getActiveAccountNumbers = ({ accounts = [], initialAccountNumber }) => {
  const activeAccounts = accounts.filter(({ accountStatus, accountNo }) => {
    return accountStatus === ACTIVE || accountNo === initialAccountNumber;
  });

  return uniq(activeAccounts.map(({ name, accountNo, accountStatus }) => ({
    label: `${name} (${accountNo}) ${accountStatus === INACTIVE ? ' - Inactive' : ''}`,
    value: accountNo,
  })));
};
