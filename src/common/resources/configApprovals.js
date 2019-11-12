import {
  CONFIG_NAME_APPROVALS,
  CONFIG_API,
  CONFIG_MODULE_INVOICE,
} from '../constants';

import { BASE_RESOURCE } from './base';

// eslint-disable-next-line import/prefer-default-export
export const configApprovals = {
  ...BASE_RESOURCE,
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
