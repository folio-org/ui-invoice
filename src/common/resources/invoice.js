import { baseManifest, INVOICES_API } from '@folio/stripes-acq-components';

import {
  INVOICE_LINE_API,
  INVOICE_DOCUMENTS_API,
} from '../constants';

export const invoicesResource = {
  ...baseManifest,
  path: INVOICES_API,
  records: 'invoices',
};

export const invoiceResource = {
  ...baseManifest,
  path: `${INVOICES_API}/:{id}`,
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
  path: `${INVOICES_API}/:{id}${INVOICE_DOCUMENTS_API}`,
  records: 'documents',
  shouldRefresh: () => false,
};

export const invoiceDocumentFromPropsResource = {
  ...baseManifest,
  path: `${INVOICES_API}/:{id}${INVOICE_DOCUMENTS_API}/!{documentId}`,
};
