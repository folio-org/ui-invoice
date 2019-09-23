const APPROVE_ERROR_CODES = {
  voucherNumberPrefixNotAlpha: 'voucherNumberPrefixNotAlpha',
  FundDistributionsNotPresent: 'FundDistributionsNotPresent',
};

// eslint-disable-next-line import/prefer-default-export
export const getApproveErrorMessage = (errorCode) => {
  return APPROVE_ERROR_CODES[errorCode]
    ? `ui-invoice.invoice.actions.approve.error.${APPROVE_ERROR_CODES[errorCode]}`
    : 'ui-invoice.invoice.actions.approve.error';
};
