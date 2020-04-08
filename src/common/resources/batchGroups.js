import { baseManifest } from '@folio/stripes-acq-components';

import {
  BATCH_GROUPS_API,
} from '../constants';

export const batchGroupsResource = {
  ...baseManifest,
  path: BATCH_GROUPS_API,
  GET: {
    params: {
      query: 'cql.allRecords=1 sortby name',
    },
  },
  records: 'batchGroups',
  accumulate: true,
  fetch: false,
};

export const batchGroupByPropResource = {
  ...baseManifest,
  path: `${BATCH_GROUPS_API}/!{id}`,
  accumulate: true,
  fetch: false,
};
