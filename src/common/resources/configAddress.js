import {
  baseManifest,
  CONFIG_API,
  MODULE_TENANT,
  CONFIG_ADDRESSES,
} from '@folio/stripes-acq-components';

export const configAddress = {
  ...baseManifest,
  records: 'configs',
  path: CONFIG_API,
  GET: {
    params: {
      query: `(module=${MODULE_TENANT} and configName=${CONFIG_ADDRESSES})`,
    },
  },
};

export const configAddressItem = {
  ...baseManifest,
  path: `${CONFIG_API}/!{billToId}`,
};
