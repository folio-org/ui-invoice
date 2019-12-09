import {
  CONFIG_API,
  CONFIG_MODULE_TENANT,
} from '../constants';
import { BASE_RESOURCE } from './base';

// eslint-disable-next-line import/prefer-default-export
export const configAddress = {
  ...BASE_RESOURCE,
  records: 'configs',
  path: CONFIG_API,
  GET: {
    params: {
      query: `(module=${CONFIG_MODULE_TENANT} and configName=tenant.addresses)`,
    },
  },
};

export const configAddressItem = {
  ...BASE_RESOURCE,
  path: `${CONFIG_API}/!{billToId}`,
};
