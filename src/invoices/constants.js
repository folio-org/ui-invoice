export const INVOICE_FORM = 'invoiceForm';
export const INVOICE_LINE_FORM = 'invoiceLineForm';

export const SECTIONS_INVOICE = {
  information: 'information',
  lines: 'invoiceLines',
  vendorDetails: 'vendorDetails',
  voucher: 'voucher',
  documents: 'documents',
  adjustments: 'invoiceAdjustments',
  fundDistribution: 'invoiceFundDistribution',
};

export const SECTIONS_INVOICE_FORM = {
  information: `${INVOICE_FORM}-information`,
  lines: `${INVOICE_FORM}-invoiceLines`,
  vendorDetails: `${INVOICE_FORM}-vendorDetails`,
  voucher: `${INVOICE_FORM}-voucher`,
  documents: `${INVOICE_FORM}-documents`,
  adjustments: `${INVOICE_FORM}-invoiceAdjustments`,
  fundDistribution: `${INVOICE_FORM}-invoiceFundDistribution`,
  extendedInformation: `${INVOICE_FORM}-extendedInformation`,
};

export const SECTIONS_INVOICE_LINE = {
  information: 'invoiceLineInformation',
  fundDistribution: 'invoiceLineFundDistribution',
  adjustments: 'invoiceLineAdjustments',
};

export const SECTIONS_INVOICE_LINE_FORM = {
  information: `${INVOICE_LINE_FORM}-information`,
  fundDistribution: `${INVOICE_LINE_FORM}-fundDistribution`,
  adjustments: `${INVOICE_LINE_FORM}-adjustments`,
};

export const SECTIONS_VOUCHER = {
  voucher: 'voucher',
  voucherLines: 'voucherLines',
};
