import React from 'react';
import { FormattedMessage } from 'react-intl';

export const CONFIG_MODULE_TAGS = 'TAGS';
export const CONFIG_MODULE_TENANT = 'TENANT';
export const CONFIG_MODULE_INVOICE = 'INVOICE';
export const CONFIG_NAME_ADJUSTMENTS = `${CONFIG_MODULE_INVOICE}.adjustments`;
export const CONFIG_NAME_TAGS_ENABLED = 'tags_enabled';
export const CONFIG_NAME_VOUCHER_NUMBER = 'voucherNumber';
export const CONFIG_NAME_APPROVALS = 'approvals';
export const LIMIT_MAX = 2147483647;

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

export const PRE_PAY_INVOICE_STATUSES_OPTIONS = INVOICE_STATUSES_OPTIONS
  .filter(option => [INVOICE_STATUS.open, INVOICE_STATUS.reviewed].includes(option.value));

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
    labelId: ADJUSTMENT_TYPE_LABELS[ADJUSTMENT_TYPE_VALUES.percent],
    value: ADJUSTMENT_TYPE_VALUES.percent,
  },
  {
    labelId: ADJUSTMENT_TYPE_LABELS[ADJUSTMENT_TYPE_VALUES.amount],
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
    labelId: ADJUSTMENT_PRORATE_LABELS[ADJUSTMENT_PRORATE_VALUES.byLine],
    value: ADJUSTMENT_PRORATE_VALUES.byLine,
  },
  {
    labelId: ADJUSTMENT_PRORATE_LABELS[ADJUSTMENT_PRORATE_VALUES.byAmount],
    value: ADJUSTMENT_PRORATE_VALUES.byAmount,
  },
  {
    labelId: ADJUSTMENT_PRORATE_LABELS[ADJUSTMENT_PRORATE_VALUES.byQuantity],
    value: ADJUSTMENT_PRORATE_VALUES.byQuantity,
  },
  {
    labelId: ADJUSTMENT_PRORATE_LABELS[ADJUSTMENT_PRORATE_VALUES.notProrated],
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
    labelId: ADJUSTMENT_RELATION_TO_TOTAL_LABELS[ADJUSTMENT_RELATION_TO_TOTAL_VALUES.inAdditionTo],
    value: ADJUSTMENT_RELATION_TO_TOTAL_VALUES.inAdditionTo,
  },
  {
    labelId: ADJUSTMENT_RELATION_TO_TOTAL_LABELS[ADJUSTMENT_RELATION_TO_TOTAL_VALUES.includedIn],
    value: ADJUSTMENT_RELATION_TO_TOTAL_VALUES.includedIn,
  },
  {
    labelId: ADJUSTMENT_RELATION_TO_TOTAL_LABELS[ADJUSTMENT_RELATION_TO_TOTAL_VALUES.separateFrom],
    value: ADJUSTMENT_RELATION_TO_TOTAL_VALUES.separateFrom,
  },
];

export const CONTENT_TYPES = {
  json: 'application/json',
  octet: 'application/octet-stream',
  xml: 'application/xml',
};

export const ERROR_CODES = {
  accountingCodeNotPresent: 'accountingCodeNotPresent',
  voucherNumberPrefixNotAlpha: 'voucherNumberPrefixNotAlpha',
  fundDistributionsNotPresent: 'fundDistributionsNotPresent',
  poLineUpdateFailure: 'poLineUpdateFailure',
  fundCannotBePaid: 'fundCannotBePaid',
  transactionCreationFailure: 'transactionCreationFailure',
  inactiveExpenseClass: 'inactiveExpenseClass',
  budgetExpenseClassNotFound: 'budgetExpenseClassNotFound',
  lockCalculatedTotalsMismatch: 'lockCalculatedTotalsMismatch',
  organizationIsNotVendor: 'organizationIsNotVendor',
  budgetNotFoundByFundId: 'budgetNotFoundByFundId',
  adjustmentFundDistributionsNotPresent: 'adjustmentFundDistributionsNotPresent',
  lineFundDistributionsSummaryMismatch: 'lineFundDistributionsSummaryMismatch',
  adjustmentFundDistributionsSummaryMismatch: 'adjustmentFundDistributionsSummaryMismatch',
  fundsNotFound: 'fundsNotFound',
  externalAccountNoIsMissing: 'externalAccountNoIsMissing',
  pendingPaymentError: 'pendingPaymentError',
  currentFYearNotFound: 'currentFYearNotFound',
  expenseClassNotFound: 'expenseClassNotFound',
  organizationIsNotExist: 'organizationIsNotExist',
};

export const VALIDATION_ERRORS = {
  dublicateInvoice: 'dublicateInvoice',
};

export const RETURN_LINK = '/invoice';
export const RETURN_LINK_LABEL_ID = 'ui-invoice.meta.title';

export const VOUCHER_STATUSES = {
  awaitingPayment: 'Awaiting payment',
  paid: 'Paid',
};

export const VOUCHER_STATUS_LABEL = {
  [VOUCHER_STATUSES.awaitingPayment]: <FormattedMessage id="ui-invoice.voucher.status.awaitingPayment" />,
  [VOUCHER_STATUSES.paid]: <FormattedMessage id="ui-invoice.voucher.status.paid" />,
};
