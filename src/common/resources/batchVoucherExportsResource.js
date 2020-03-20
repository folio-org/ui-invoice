import { baseManifest } from '@folio/stripes-acq-components';

import { BATCH_VOUCHER_EXPORTS_API } from '../constants';

// eslint-disable-next-line import/prefer-default-export
export const batchVoucherExportsResource = {
  ...baseManifest,
  path: BATCH_VOUCHER_EXPORTS_API,
  GET: {
    params: {
      query: 'cql.allRecords=1 sortby end/sort.descending start/sort.descending',
    },
  },
  records: 'batchVoucherExports',
  accumulate: true,
  fetch: false,
};
