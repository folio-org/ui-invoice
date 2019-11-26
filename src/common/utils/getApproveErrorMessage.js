export const APPROVE_ERROR_CODES = {
  voucherNumberPrefixNotAlpha: 'voucherNumberPrefixNotAlpha',
  FundDistributionsNotPresent: 'FundDistributionsNotPresent',
  poLineUpdateFailure: 'poLineUpdateFailure',
  fundCanNotBePaid: 'fundCanNotBePaid',
};

export const getApproveErrorMessage = (errorCode, genericError = 'ui-invoice.invoice.actions.approve.error') => {
  return APPROVE_ERROR_CODES[errorCode]
    ? `ui-invoice.invoice.actions.approve.error.${APPROVE_ERROR_CODES[errorCode]}`
    : genericError;
};
