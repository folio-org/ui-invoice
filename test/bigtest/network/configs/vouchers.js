import {
  createGetAll,
  createGetById,
  createPut,
} from '@folio/stripes-acq-components/test/bigtest/network/configs';

import { VOUCHERS_API } from '../../../../src/common/constants/api';

const SCHEMA_NAME = 'vouchers';

const configVouchers = server => {
  server.get(VOUCHERS_API, createGetAll(SCHEMA_NAME));
  server.get(`${VOUCHERS_API}/:id`, createGetById(SCHEMA_NAME));
  server.put(`${VOUCHERS_API}/:id`, createPut(SCHEMA_NAME));
};

export default configVouchers;
