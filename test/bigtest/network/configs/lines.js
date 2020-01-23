import {
  createGetAll,
  createGetById,
  createPost,
  createPut,
} from '@folio/stripes-acq-components/test/bigtest/network/configs';

import { INVOICE_LINE_API } from '../../../../src/common/constants';

const SCHEMA_NAME = 'lines';

const configLines = server => {
  server.get(INVOICE_LINE_API, createGetAll(SCHEMA_NAME));
  server.get(`${INVOICE_LINE_API}/:id`, createGetById(SCHEMA_NAME));
  server.put(`${INVOICE_LINE_API}/:id`, createPut(SCHEMA_NAME));
  server.delete(`${INVOICE_LINE_API}/:id`, 'line');
  server.post(`${INVOICE_LINE_API}`, createPost(SCHEMA_NAME));
};

export default configLines;
