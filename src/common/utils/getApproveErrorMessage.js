export const APPROVE_ERROR_CODES = {
  accountingCodeNotPresent: 'accountingCodeNotPresent',
  voucherNumberPrefixNotAlpha: 'voucherNumberPrefixNotAlpha',
  fundDistributionsNotPresent: 'fundDistributionsNotPresent',
  poLineUpdateFailure: 'poLineUpdateFailure',
  fundCannotBePaid: 'fundCannotBePaid',
  transactionCreationFailure: 'transactionCreationFailure',
};

export const getApproveErrorMessage = (errorCode, genericError = 'ui-invoice.invoice.actions.approve.error') => {
  return APPROVE_ERROR_CODES[errorCode]
    ? `ui-invoice.invoice.actions.approve.error.${APPROVE_ERROR_CODES[errorCode]}`
    : genericError;
};
