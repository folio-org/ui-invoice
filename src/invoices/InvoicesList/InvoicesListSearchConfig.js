const indexes = [
  'voucherNumber',
  'vendorInvoiceNo',
  // 'poNumbers',  disabled in UINV-163, to enable in UINV-162
  'accountingCode',
];

export const searchableIndexes = [
  {
    labelId: 'ui-invoice.search.keyword',
    value: '',
  },
  ...indexes.map(index => ({ labelId: `ui-invoice.search.${index}`, value: index })),
];

export const getKeywordQuery = query => [...indexes, 'invoiceLines.description'].reduce(
  (acc, sIndex) => {
    if (acc) {
      return `${acc} or ${sIndex}="${query}*"`;
    } else {
      return `${sIndex}="${query}*"`;
    }
  },
  '',
);
