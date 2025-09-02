import { baseManifest } from '@folio/stripes-acq-components';
import {
  CONFIG_NAME_VOUCHER_NUMBER,
  INVOICE_STORAGE_SETTINGS_API,
} from '../constants';

export const configVoucherNumber = {
  ...baseManifest,
  records: 'settings',
  path: INVOICE_STORAGE_SETTINGS_API,
  GET: {
    params: {
      query: `(key=${CONFIG_NAME_VOUCHER_NUMBER})`,
    },
  },
};
