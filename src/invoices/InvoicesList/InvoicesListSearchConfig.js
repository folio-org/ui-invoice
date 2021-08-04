const indexes = [
  'voucherNumber',
  'vendorInvoiceNo',
  'poNumbers',
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
