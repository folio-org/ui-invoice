import { baseManifest } from '@folio/stripes-acq-components';

import {
  INVOICE_API,
  INVOICE_LINE_API,
  INVOICE_DOCUMENTS_API,
} from '../constants';

export const invoicesResource = {
  ...baseManifest,
  path: INVOICE_API,
  records: 'invoices',
};

export const invoiceResource = {
  ...baseManifest,
  path: `${INVOICE_API}/:{id}`,
};

export const invoiceLineResource = {
  ...baseManifest,
  path: `${INVOICE_LINE_API}`,
  GET: {
    path: `${INVOICE_LINE_API}/:{lineId}`,
  },
};

export const invoiceLinesResource = {
  ...baseManifest,
  path: `${INVOICE_LINE_API}`,
};

export const invoiceDocumentsResource = {
  ...baseManifest,
  path: `${INVOICE_API}/:{id}${INVOICE_DOCUMENTS_API}`,
  records: 'documents',
  shouldRefresh: false,
};

export const invoiceDocumentFromPropsResource = {
  ...baseManifest,
  path: `${INVOICE_API}/:{id}${INVOICE_DOCUMENTS_API}/!{documentId}`,
};
