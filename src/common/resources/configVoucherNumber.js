import { baseManifest } from '@folio/stripes-acq-components';
import {
  CONFIG_API,
  CONFIG_MODULE_INVOICE,
  CONFIG_NAME_VOUCHER_NUMBER,
} from '../constants';

// eslint-disable-next-line import/prefer-default-export
export const configVoucherNumber = {
  ...baseManifest,
  records: 'configs',
  path: CONFIG_API,
  GET: {
    params: {
      query: `(module=${CONFIG_MODULE_INVOICE} and configName=${CONFIG_NAME_VOUCHER_NUMBER})`,
    },
  },
};
