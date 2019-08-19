import {
  INVOICE_API,
  INVOICE_DOCUMENTS_API,
} from '../../../../src/common/constants';

const configDocuments = server => {
  server.get(`${INVOICE_API}/:id${INVOICE_DOCUMENTS_API}`, (schema) => {
    return schema.documents.all();
  });

  server.post(`${INVOICE_API}/:id${INVOICE_DOCUMENTS_API}`, (schema, request) => {
    const attrs = JSON.parse(request.requestBody) || {};

    return schema.documents.create(attrs).attrs;
  });

  server.delete(`${INVOICE_API}/:id${INVOICE_DOCUMENTS_API}/:documentId`, (schema, request) => {
    const invoiceDocument = schema.documents.find(request.params.documentId);

    invoiceDocument.destroy();

    return null;
  });
};

export default configDocuments;
