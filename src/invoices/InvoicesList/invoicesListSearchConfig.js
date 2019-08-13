export const invoicesSearchTemplate = `(
  voucherNumber="%{query.query}*" OR
  vendorInvoiceNo="%{query.query}*" OR
  poNumbers="%{query.query}*" OR
  accountingCode="%{query.query}*"
)`;

const indexes = [
  'voucherNumber',
  'vendorInvoiceNo',
  'poNumbers',
  'accountingCode',
];

const keywordIndex = {
  label: 'keyword',
  value: '',
};

export const searchableIndexes = [keywordIndex, ...indexes.map(index => ({ label: index, value: index }))];
