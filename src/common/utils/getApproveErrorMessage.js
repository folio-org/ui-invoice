export const APPROVE_ERROR_CODES = {
  voucherNumberPrefixNotAlpha: 'voucherNumberPrefixNotAlpha',
  fundDistributionsNotPresent: 'fundDistributionsNotPresent',
  poLineUpdateFailure: 'poLineUpdateFailure',
  fundCannotBePaid: 'fundCannotBePaid',
};

export const getApproveErrorMessage = (errorCode, genericError = 'ui-invoice.invoice.actions.approve.error') => {
  return APPROVE_ERROR_CODES[errorCode]
    ? `ui-invoice.invoice.actions.approve.error.${APPROVE_ERROR_CODES[errorCode]}`
    : genericError;
};
