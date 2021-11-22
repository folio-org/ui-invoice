import { INVOICES_API } from '@folio/stripes-acq-components';

import {
  createGetAll,
  createGetById,
  createPost,
  createPut,
} from '@folio/stripes-acq-components/test/bigtest/network/configs';

const SCHEMA_NAME = 'invoices';

const configInvoices = server => {
  server.get(INVOICES_API, createGetAll(SCHEMA_NAME));
  server.get(`${INVOICES_API}/:id`, createGetById(SCHEMA_NAME));
  server.put(`${INVOICES_API}/:id`, createPut(SCHEMA_NAME));
  server.delete(`${INVOICES_API}/:id`, 'invoice');
  server.post(`${INVOICES_API}`, createPost(SCHEMA_NAME));
};

export default configInvoices;
