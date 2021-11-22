import { baseManifest } from '@folio/stripes-acq-components';

import {
  VOUCHERS_API,
  VOUCHER_LINES_API,
  VOUCHER_NUMBER_START_API,
} from '../constants';

export const VOUCHER = {
  ...baseManifest,
  accumulate: true,
  fetch: false,
  path: VOUCHERS_API,
  records: 'vouchers',
  params: {
    query: 'invoiceId==!{invoiceId}',
  },
};

export const VOUCHER_BY_ID = {
  ...baseManifest,
  path: VOUCHERS_API,
  GET: {
    path: `${VOUCHERS_API}/:{voucherId}`,
  },
};

export const VOUCHER_LINES = {
  ...baseManifest,
  path: VOUCHER_LINES_API,
  records: 'voucherLines',
};

export const VOUCHER_NUMBER_START = {
  ...baseManifest,
  path: VOUCHER_NUMBER_START_API,
  POST: {
    path: `${VOUCHER_NUMBER_START_API}/%{sequenceNumber}`,
  },
};
