import {
  createGetAll,
  createPost,
  createPut,
} from '@folio/stripes-acq-components/test/bigtest/network/configs';

import { EXPORT_CONFIGURATIONS_API } from '../../../../src/common/constants';

const SCHEMA_NAME = 'exportConfigs';

export default server => {
  server.get(EXPORT_CONFIGURATIONS_API, createGetAll(SCHEMA_NAME));
  server.put(`${EXPORT_CONFIGURATIONS_API}/:id`, createPut(SCHEMA_NAME));
  server.post(EXPORT_CONFIGURATIONS_API, createPost(SCHEMA_NAME));
};
