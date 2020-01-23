import {
  createGetAll,
  createGetById,
  createPost,
  createPut,
} from '@folio/stripes-acq-components/test/bigtest/network/configs';

import { INVOICE_API } from '../../../../src/common/constants';

const SCHEMA_NAME = 'invoices';

const configInvoices = server => {
  server.get(INVOICE_API, createGetAll(SCHEMA_NAME));
  server.get(`${INVOICE_API}/:id`, createGetById(SCHEMA_NAME));
  server.put(`${INVOICE_API}/:id`, createPut(SCHEMA_NAME));
  server.delete(`${INVOICE_API}/:id`, 'invoice');
  server.post(`${INVOICE_API}`, createPost(SCHEMA_NAME));
};

export default configInvoices;
