import { BASE_RESOURCE } from './base';
import {
  CONFIG_NAME_ADJUSTMENTS,
  CONFIG_API,
  CONFIG_MODULE_INVOICE,
} from '../constants';

export const CONFIG_ADJUSTMENTS = {
  ...BASE_RESOURCE,
  path: CONFIG_API,
  records: 'configs',
  GET: {
    params: {
      query: `(module=${CONFIG_MODULE_INVOICE} and configName=${CONFIG_NAME_ADJUSTMENTS}) sortby code`,
    },
  },
};

export const CONFIG_ADJUSTMENT = {
  ...BASE_RESOURCE,
  path: `${CONFIG_API}/:{id}`,
};
