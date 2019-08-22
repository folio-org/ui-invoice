import {
  VOUCHERS_API,
  VOUCHER_LINES_API,
  VOUCHER_NUMBER_START_API,
} from '../constants';
import { BASE_RESOURCE } from './base';

export const VOUCHER = {
  ...BASE_RESOURCE,
  accumulate: true,
  fetch: false,
  path: VOUCHERS_API,
  records: 'vouchers',
  params: {
    query: 'invoiceId==!{invoiceId}',
  },
};

export const VOUCHER_BY_ID = {
  ...BASE_RESOURCE,
  path: VOUCHERS_API,
  GET: {
    path: `${VOUCHERS_API}/:{voucherId}`,
  },
};

export const VOUCHER_LINES = {
  ...BASE_RESOURCE,
  path: VOUCHER_LINES_API,
  records: 'voucherLines',
};

export const VOUCHER_NUMBER_START = {
  ...BASE_RESOURCE,
  path: VOUCHER_NUMBER_START_API,
  POST: {
    path: `${VOUCHER_NUMBER_START_API}/%{sequenceNumber}`,
  },
};
