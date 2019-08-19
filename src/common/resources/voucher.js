import { get } from 'lodash';
import { getFormValues } from 'redux-form';
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

export const VOUCHER_LINES = {
  ...BASE_RESOURCE,
  path: VOUCHER_LINES_API,
  records: 'voucherLines',
};

export const VOUCHER_NUMBER_START = {
  ...BASE_RESOURCE,
  path: VOUCHER_NUMBER_START_API,
  POST: {

    path: (queryParams, pathComponents, resourceData, categories, stripesParams) => {
      const { stripes } = stripesParams;

      const form = getFormValues('configForm')(stripes.store.getState()) || {};

      const { allowVoucherNumberEdit } = form;
      let { sequenceNumber } = form;

      if (!allowVoucherNumberEdit) {
        sequenceNumber = get(resourceData, ['voucher_number', 'records', 0, 'sequenceNumber']);
      }

      if (sequenceNumber) return `${VOUCHER_NUMBER_START_API}/${sequenceNumber}`;

      return undefined;
    },
  },
};
