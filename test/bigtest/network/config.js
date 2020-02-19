import {
  configTags,
  configUsers,
  configUnits,
  configVendors,
  configMemberships,
  configFunds,
  configTransactions,
} from '@folio/stripes-acq-components/test/bigtest/network';

import configBatchGroups from './configs/batchgroup';
import configInvoices from './configs/invoices';
import configInvoiceLines from './configs/lines';
import configVouchers from './configs/vouchers';
import configVoucherLines from './configs/voucherLines';
import configSettingVoucherNumber from './configs/settingVoucherNumber';
import configDocuments from './configs/documents';

export default function config() {
  configInvoices(this);
  configInvoiceLines(this);
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
  configTransactions(this);
  configBatchGroups(this);
}
