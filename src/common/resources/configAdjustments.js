import { baseManifest, CONFIG_API } from '@folio/stripes-acq-components';

import {
  CONFIG_NAME_ADJUSTMENTS,
  CONFIG_MODULE_INVOICE,
} from '../constants';

export const CONFIG_ADJUSTMENTS = {
  ...baseManifest,
  path: CONFIG_API,
  records: 'configs',
  GET: {
    params: {
      query: `(module=${CONFIG_MODULE_INVOICE} and configName=${CONFIG_NAME_ADJUSTMENTS}) sortby code`,
    },
  },
};

export const CONFIG_ADJUSTMENT = {
  ...baseManifest,
  path: `${CONFIG_API}/:{id}`,
};
