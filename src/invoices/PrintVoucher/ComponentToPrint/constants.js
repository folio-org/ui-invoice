import React from 'react';
import { FormattedMessage } from 'react-intl';

export const LINE_FIELDS_MAP = {
  lineNumber: 'lineNumber',
  fundDistributions: 'fundDistributions',
  externalAccountNumber: 'externalAccountNumber',
  amount: 'amount',
};

export const LINE_FIELDS_LABELS = {
  [LINE_FIELDS_MAP.externalAccountNumber]: <FormattedMessage id="ui-invoice.voucher.voucherLines.externalAccountNumber" />,
  [LINE_FIELDS_MAP.amount]: <FormattedMessage id="ui-invoice.voucher.voucherLines.amount" />,
  [LINE_FIELDS_MAP.fundDistributions]: <FormattedMessage id="ui-invoice.voucher.voucherLines.fundCode" />,
  [LINE_FIELDS_MAP.lineNumber]: <FormattedMessage id="ui-invoice.voucher.print.lineNumber" />,
};
