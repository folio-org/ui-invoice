import { baseManifest } from '@folio/stripes-acq-components';

import { BATCH_VOUCHERS_API } from '../constants';

// eslint-disable-next-line import/prefer-default-export
export const batchVouchersFromPropResource = {
  ...baseManifest,
  path: `${BATCH_VOUCHERS_API}/!{batchVoucherId}`,
  accumulate: true,
  fetch: false,
};
