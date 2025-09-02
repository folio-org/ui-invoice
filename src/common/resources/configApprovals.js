import { baseManifest } from '@folio/stripes-acq-components';

import {
  CONFIG_NAME_APPROVALS,
  INVOICE_STORAGE_SETTINGS_API,
} from '../constants';

export const configApprovals = {
  ...baseManifest,
  path: INVOICE_STORAGE_SETTINGS_API,
  records: 'settings',
  fetch: false,
  accumulate: true,
  GET: {
    params: {
      query: `(key=${CONFIG_NAME_APPROVALS})`,
    },
  },
};
