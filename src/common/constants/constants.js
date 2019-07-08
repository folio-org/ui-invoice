import React from 'react';
import { FormattedMessage } from 'react-intl';

export const DATE_FORMAT = 'MM/DD/YYYY';
export const CONFIG_MODULE_TENANT = 'TENANT';
export const LIMIT_MAX = 2147483647;
export const ORGANIZATION_STATUS_ACTIVE = 'Active';

export const INVOICE_STATUS = {
  open: 'Open',
  approved: 'Approved',
  paid: 'Paid',
  cancelled: 'Cancelled',
  reviewed: 'Reviewed',
};

export const INVOICE_STATUSES_OPTIONS = [
  { label: <FormattedMessage id="ui-invoice.invoice.status.open" />, value: INVOICE_STATUS.open },
  { label: <FormattedMessage id="ui-invoice.invoice.status.reviewed" />, value: INVOICE_STATUS.reviewed },
  { label: <FormattedMessage id="ui-invoice.invoice.status.approved" />, value: INVOICE_STATUS.approved },
  { label: <FormattedMessage id="ui-invoice.invoice.status.paid" />, value: INVOICE_STATUS.paid },
  { label: <FormattedMessage id="ui-invoice.invoice.status.cancelled" />, value: INVOICE_STATUS.cancelled },
];

export const PAYMENT_METHOD = {
  cash: 'Cash',
  creditCard: 'Credit Card P Card',
  eft: 'EFT',
  depositAccount: 'Deposit Account',
  physicalCheck: 'Physical Check',
  bankDraft: 'Bank Draft',
  internalTransfer: 'Internal Transfer',
  other: 'other',
};

export const PAYMENT_METHODS_OPTIONS = [
  { label: <FormattedMessage id="ui-invoice.paymentMethod.cash" />, value: PAYMENT_METHOD.cash },
  { label: <FormattedMessage id="ui-invoice.paymentMethod.creditCard" />, value: PAYMENT_METHOD.creditCard },
  { label: <FormattedMessage id="ui-invoice.paymentMethod.eft" />, value: PAYMENT_METHOD.eft },
  { label: <FormattedMessage id="ui-invoice.paymentMethod.depositAccount" />, value: PAYMENT_METHOD.depositAccount },
  { label: <FormattedMessage id="ui-invoice.paymentMethod.physicalCheck" />, value: PAYMENT_METHOD.physicalCheck },
  { label: <FormattedMessage id="ui-invoice.paymentMethod.bankDraft" />, value: PAYMENT_METHOD.bankDraft },
  { label: <FormattedMessage id="ui-invoice.paymentMethod.internalTransfer" />, value: PAYMENT_METHOD.internalTransfer },
  { label: <FormattedMessage id="ui-invoice.paymentMethod.other" />, value: PAYMENT_METHOD.other },
];

export const POST_APPROVAL_STATUSES = [INVOICE_STATUS.approved, INVOICE_STATUS.paid, INVOICE_STATUS.cancelled];
