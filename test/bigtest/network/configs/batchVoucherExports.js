import {
  createGetAll,
  createGetById,
  createPost,
  createPut,
} from '@folio/stripes-acq-components/test/bigtest/network/configs';

import { BATCH_VOUCHER_EXPORTS_API as API } from '../../../../src/common/constants';

const SCHEMA_NAME = 'batchvoucherexports';

export default server => {
  server.get(API, createGetAll(SCHEMA_NAME));
  server.get(`${API}/:id`, createGetById(SCHEMA_NAME));
  server.put(`${API}/:id`, createPut(SCHEMA_NAME));
  server.post(API, createPost(SCHEMA_NAME));
};
