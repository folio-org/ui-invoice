import { baseManifest, CONFIG_API } from '@folio/stripes-acq-components';

import {
  CONFIG_NAME_APPROVALS,
  CONFIG_MODULE_INVOICE,
} from '../constants';

export const configApprovals = {
  ...baseManifest,
  path: CONFIG_API,
  records: 'configs',
  fetch: false,
  accumulate: true,
  GET: {
    params: {
      query: `(module=${CONFIG_MODULE_INVOICE} and configName=${CONFIG_NAME_APPROVALS})`,
    },
  },
};
