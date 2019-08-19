import configInvoices from './configs/invoices';
import configLines from './configs/lines';
import configVendors from './configs/vendors';
import configUnits from './configs/units';
import configUsers from './configs/users';
import configVouchers from './configs/vouchers';
import configVoucherLines from './configs/voucherLines';
import configSettingVoucherNumber from './configs/settingVoucherNumber';
import configDocuments from './configs/documents';
import configTags from './configs/tags';

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
}
