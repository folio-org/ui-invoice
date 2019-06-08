import { VENDORS_API } from '../constants';
import { BASE_RESOURCE } from './base';

// eslint-disable-next-line import/prefer-default-export
export const VENDORS = {
  path: VENDORS_API,
  GET: {
    params: {
      query: 'cql.allRecords=1 sortby name',
    },
  },
  records: 'organizations',
  ...BASE_RESOURCE,
};
