import { baseManifest } from '@folio/stripes-acq-components';

import {
  BATCH_GROUPS_API,
} from '../constants';

// eslint-disable-next-line import/prefer-default-export
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
