export const APPROVE_ERROR_CODES = {
  accountingCodeNotPresent: 'accountingCodeNotPresent',
  voucherNumberPrefixNotAlpha: 'voucherNumberPrefixNotAlpha',
  fundDistributionsNotPresent: 'fundDistributionsNotPresent',
  poLineUpdateFailure: 'poLineUpdateFailure',
  fundCannotBePaid: 'fundCannotBePaid',
  transactionCreationFailure: 'transactionCreationFailure',
  inactiveExpenseClass: 'inactiveExpenseClass',
};

export const getActionErrorMessage = (errorCode, genericError = 'ui-invoice.invoice.actions.approve.error', action = 'approve') => {
  return APPROVE_ERROR_CODES[errorCode]
    ? `ui-invoice.invoice.actions.${action}.error.${APPROVE_ERROR_CODES[errorCode]}`
    : genericError;
};
