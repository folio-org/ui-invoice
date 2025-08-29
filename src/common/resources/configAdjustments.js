import { baseManifest } from '@folio/stripes-acq-components';

import {
  CONFIG_NAME_ADJUSTMENTS,
  INVOICE_STORAGE_SETTINGS_API,
} from '../constants';

export const CONFIG_ADJUSTMENTS = {
  ...baseManifest,
  path: INVOICE_STORAGE_SETTINGS_API,
  records: 'settings',
  GET: {
    params: {
      query: `(key=${CONFIG_NAME_ADJUSTMENTS}) sortby metadata.createdDate`,
    },
  },
};

export const CONFIG_ADJUSTMENT = {
  ...baseManifest,
  path: `${INVOICE_STORAGE_SETTINGS_API}/:{id}`,
};
