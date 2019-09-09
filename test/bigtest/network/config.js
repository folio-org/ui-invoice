import {
  configTags,
  configUsers,
  configUnits,
  configVendors,
  configMemberships,
  configFunds,
} from '@folio/stripes-acq-components/test/bigtest/network';

import configInvoices from './configs/invoices';
import configLines from './configs/lines';
import configVouchers from './configs/vouchers';
import configVoucherLines from './configs/voucherLines';
import configSettingVoucherNumber from './configs/settingVoucherNumber';
import configDocuments from './configs/documents';

export default function config() {
  configInvoices(this);
  configLines(this);
  configVendors(this);
  configUnits(this);
  configUsers(this);
  configVouchers(this);
  configVoucherLines(this);
  configSettingVoucherNumber(this);
  configDocuments(this);
  configTags(this);
  configMemberships(this);
  configFunds(this);
}
