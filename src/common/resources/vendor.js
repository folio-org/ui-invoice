import { get } from 'lodash';

import { VENDORS_API } from '../constants';
import { BASE_RESOURCE } from './base';

export const VENDORS = {
  ...BASE_RESOURCE,
  path: VENDORS_API,
  GET: {
    params: {
      query: 'cql.allRecords=1 sortby name',
    },
  },
  records: 'organizations',
};

export const vendorItem = {
  ...BASE_RESOURCE,
  path: `${VENDORS_API}/!{vendorId}`,
};

export const VENDOR = {
  ...BASE_RESOURCE,
  path: (queryParams, pathComponents, resourceData, logger, props) => {
    const vendorId = get(props, ['resources', 'invoice', 'records', 0, 'vendorId']);

    return vendorId ? `${VENDORS_API}/${vendorId}` : null;
  },
};
