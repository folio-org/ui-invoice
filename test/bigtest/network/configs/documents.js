import { INVOICES_API } from '@folio/stripes-acq-components';

import {
  INVOICE_DOCUMENTS_API,
} from '../../../../src/common/constants';

const configDocuments = server => {
  server.get(`${INVOICES_API}/:id${INVOICE_DOCUMENTS_API}`, (schema) => {
    return schema.documents.all();
  });

  server.post(`${INVOICES_API}/:id${INVOICE_DOCUMENTS_API}`, (schema, request) => {
    const attrs = JSON.parse(request.requestBody) || {};

    return schema.documents.create(attrs).attrs;
  });

  server.delete(`${INVOICES_API}/:id${INVOICE_DOCUMENTS_API}/:documentId`, (schema, request) => {
    const invoiceDocument = schema.documents.find(request.params.documentId);

    invoiceDocument.destroy();

    return null;
  });
};

export default configDocuments;
