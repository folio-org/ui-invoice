import {
  VOUCHERS_API,
  VOUCHER_LINES_API,
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

export const VOUCHER_LINES = {
  ...BASE_RESOURCE,
  path: VOUCHER_LINES_API,
  records: 'voucherLines',
};
