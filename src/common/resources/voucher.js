import {
  VOUCHERS_API,
  VOUCHER_LINES_API,
} from '../constants';
import { BASE_RESOURCE } from './base';
import { get } from "lodash";

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

export const VOUCHER_NUMBER_START = {
  ...BASE_RESOURCE,
  path: 'voucher-storage/voucher-number/start',
  POST: {
    headers: {
      'Accept': 'text/plain',
      'Content-Type': 'text/plain',
    },
    path: (queryParams, pathComponents, resourceData) => {
      const sequenceNumber = get(resourceData, ['voucher_number', 'records', 0, 'sequenceNumber']);

      if (sequenceNumber) return `voucher-storage/voucher-number/start/${sequenceNumber}`;

      return undefined;
    },
  },
};
