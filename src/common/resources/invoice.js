import {
  INVOICE_API,
  INVOICE_LINE_API,
  INVOICE_DOCUMENTS_API,
} from '../constants';
import { BASE_RESOURCE } from './base';

export const invoicesResource = {
  ...BASE_RESOURCE,
  path: INVOICE_API,
  records: 'invoices',
};

export const invoiceResource = {
  ...BASE_RESOURCE,
  path: `${INVOICE_API}/:{id}`,
};

export const invoiceLineResource = {
  ...BASE_RESOURCE,
  path: `${INVOICE_LINE_API}`,
  GET: {
    path: `${INVOICE_LINE_API}/:{lineId}`,
  },
};

export const invoiceLinesResource = {
  ...BASE_RESOURCE,
  path: `${INVOICE_LINE_API}`,
};

export const invoiceDocumentsResource = {
  ...BASE_RESOURCE,
  path: `${INVOICE_API}/:{id}${INVOICE_DOCUMENTS_API}`,
  records: 'documents',
  shouldRefresh: false,
};

export const invoiceDocumentFromPropsResource = {
  ...BASE_RESOURCE,
  path: `${INVOICE_API}/:{id}${INVOICE_DOCUMENTS_API}/!{documentId}`,
};
