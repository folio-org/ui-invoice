import {
  INVOICE_LINE_API,
} from '../../constants';

export const fetchInvoiceLines = async (ky, options) => {
  const { invoiceLines } = await ky.get(INVOICE_LINE_API, { options }).json();

  return invoiceLines;
};
