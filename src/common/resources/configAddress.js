import { baseManifest, CONFIG_API } from '@folio/stripes-acq-components';

import { CONFIG_MODULE_TENANT } from '../constants';

export const configAddress = {
  ...baseManifest,
  records: 'configs',
  path: CONFIG_API,
  GET: {
    params: {
      query: `(module=${CONFIG_MODULE_TENANT} and configName=tenant.addresses)`,
    },
  },
};

export const configAddressItem = {
  ...baseManifest,
  path: `${CONFIG_API}/!{billToId}`,
};
