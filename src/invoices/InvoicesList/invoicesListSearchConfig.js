import { generateQueryTemplate } from '@folio/stripes-acq-components';

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
export const invoicesSearchTemplate = generateQueryTemplate(indexes);
