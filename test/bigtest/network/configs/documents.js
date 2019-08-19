import {
  INVOICE_API,
  INVOICE_DOCUMENTS_API,
} from '../../../../src/common/constants';

const configDocuments = server => {
  server.get(`${INVOICE_API}/:{id}${INVOICE_DOCUMENTS_API}`, (schema) => {
    return schema.documents.all();
  });
};

export default configDocuments;
