import React from 'react';
import { FormattedMessage } from 'react-intl';

export const DATE_FORMAT = 'MM/DD/YYYY';
export const CONFIG_MODULE_TENANT = 'TENANT';
export const CONFIG_MODULE_INVOICE = 'INVOICE';
export const CONFIG_NAME_ADJUSTMENTS = 'adjustments';
export const CONFIG_NAME_VOUCHER_NUMBER = 'voucherNumber';
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

export const ADJUSTMENT_TYPE_VALUES = {
  percent: 'Percentage',
  amount: 'Amount',
};

export const ADJUSTMENT_TYPE_LABELS = {
  [ADJUSTMENT_TYPE_VALUES.percent]: 'ui-invoice.adjustments.type.percent',
  [ADJUSTMENT_TYPE_VALUES.amount]: 'ui-invoice.adjustments.type.amount',
};

export const ADJUSTMENT_TYPE_OPTIONS = [
  {
    label: ADJUSTMENT_TYPE_LABELS[ADJUSTMENT_TYPE_VALUES.percent],
    value: ADJUSTMENT_TYPE_VALUES.percent,
  },
  {
    label: ADJUSTMENT_TYPE_LABELS[ADJUSTMENT_TYPE_VALUES.amount],
    value: ADJUSTMENT_TYPE_VALUES.amount,
  },
];

export const ADJUSTMENT_PRORATE_VALUES = {
  byLine: 'By line',
  byAmount: 'By amount',
  byQuantity: 'By quantity',
  notProrated: 'Not prorated',
};

export const ADJUSTMENT_PRORATE_LABELS = {
  [ADJUSTMENT_PRORATE_VALUES.byLine]: 'ui-invoice.adjustments.prorate.byLine',
  [ADJUSTMENT_PRORATE_VALUES.byAmount]: 'ui-invoice.adjustments.prorate.byAmount',
  [ADJUSTMENT_PRORATE_VALUES.byQuantity]: 'ui-invoice.adjustments.prorate.byQuantity',
  [ADJUSTMENT_PRORATE_VALUES.notProrated]: 'ui-invoice.adjustments.prorate.notProrated',
};

export const ADJUSTMENT_PRORATE_OPTIONS = [
  {
    label: ADJUSTMENT_PRORATE_LABELS[ADJUSTMENT_PRORATE_VALUES.byLine],
    value: ADJUSTMENT_PRORATE_VALUES.byLine,
  },
  {
    label: ADJUSTMENT_PRORATE_LABELS[ADJUSTMENT_PRORATE_VALUES.byAmount],
    value: ADJUSTMENT_PRORATE_VALUES.byAmount,
  },
  {
    label: ADJUSTMENT_PRORATE_LABELS[ADJUSTMENT_PRORATE_VALUES.byQuantity],
    value: ADJUSTMENT_PRORATE_VALUES.byQuantity,
  },
  {
    label: ADJUSTMENT_PRORATE_LABELS[ADJUSTMENT_PRORATE_VALUES.notProrated],
    value: ADJUSTMENT_PRORATE_VALUES.notProrated,
  },
];

export const ADJUSTMENT_RELATION_TO_TOTAL_VALUES = {
  inAdditionTo: 'In addition to',
  includedIn: 'Included in',
  separateFrom: 'Separate from',
};

export const ADJUSTMENT_RELATION_TO_TOTAL_LABELS = {
  [ADJUSTMENT_RELATION_TO_TOTAL_VALUES.inAdditionTo]: 'ui-invoice.adjustments.relationToTotal.inAdditionTo',
  [ADJUSTMENT_RELATION_TO_TOTAL_VALUES.includedIn]: 'ui-invoice.adjustments.relationToTotal.includedIn',
  [ADJUSTMENT_RELATION_TO_TOTAL_VALUES.separateFrom]: 'ui-invoice.adjustments.relationToTotal.separateFrom',
};

export const ADJUSTMENT_RELATION_TO_TOTAL_OPTIONS = [
  {
    label: ADJUSTMENT_RELATION_TO_TOTAL_LABELS[ADJUSTMENT_RELATION_TO_TOTAL_VALUES.inAdditionTo],
    value: ADJUSTMENT_RELATION_TO_TOTAL_VALUES.inAdditionTo,
  },
  {
    label: ADJUSTMENT_RELATION_TO_TOTAL_LABELS[ADJUSTMENT_RELATION_TO_TOTAL_VALUES.includedIn],
    value: ADJUSTMENT_RELATION_TO_TOTAL_VALUES.includedIn,
  },
  {
    label: ADJUSTMENT_RELATION_TO_TOTAL_LABELS[ADJUSTMENT_RELATION_TO_TOTAL_VALUES.separateFrom],
    value: ADJUSTMENT_RELATION_TO_TOTAL_VALUES.separateFrom,
  },
];

export const DEFAULT_VOUCHER_START_NUMBER = 1;
