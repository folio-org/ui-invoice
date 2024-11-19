import get from 'lodash/get';

import {
  CONFIG_ADDRESSES,
  CONFIG_API,
  LIMIT_MAX,
  MODULE_TENANT,
} from '@folio/stripes-acq-components';

export const getTenantAddresses = (ky) => async () => {
  const searchParams = {
    limit: LIMIT_MAX,
    query: `(module=${MODULE_TENANT} and configName=${CONFIG_ADDRESSES})`,
  };

  return ky.get(CONFIG_API, { searchParams }).json();
};

export const getVersionMetadata = (version, entity) => ({
  ...get(entity, 'metadata', {}),
  updatedByUserId: version?.userId,
  updatedDate: version?.actionDate,
});
