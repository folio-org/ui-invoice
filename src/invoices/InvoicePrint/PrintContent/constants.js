import React from 'react';
import { FormattedMessage } from 'react-intl';

export const LINE_FIELDS_MAP = {
  lineNumber: 'lineNumber',
  fundDistributions: 'fundDistributions',
  externalAccountNumber: 'externalAccountNumber',
  amount: 'amount',
};

export const LINE_FIELDS_LABELS = {
  [LINE_FIELDS_MAP.externalAccountNumber]: 'External account number',
  [LINE_FIELDS_MAP.amount]: 'Amount',
  [LINE_FIELDS_MAP.fundDistributions]: 'Fund code',
  [LINE_FIELDS_MAP.lineNumber]: 'Line #',
};
