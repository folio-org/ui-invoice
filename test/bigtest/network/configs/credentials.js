import {
  createPost,
} from '@folio/stripes-acq-components/test/bigtest/network/configs';

import { EXPORT_CONFIGURATIONS_API } from '../../../../src/common/constants';

export default server => {
  server.get(`${EXPORT_CONFIGURATIONS_API}/:id/credentials`, (schema) => {
    return schema.credentials.all();
  });
  server.post(`${EXPORT_CONFIGURATIONS_API}/:id/credentials`, createPost('credentials'));
  server.post(`${EXPORT_CONFIGURATIONS_API}/:id/credentials/test`, () => ({}));
};
