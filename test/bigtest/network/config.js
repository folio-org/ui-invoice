import configInvoices from './configs/invoices';
import configLines from './configs/lines';
import configVendors from './configs/vendors';
import configUnits from './configs/units';
import configUsers from './configs/users';
import configVouchers from './configs/vouchers';
import configVoucherLines from './configs/voucherLines';
import configDocuments from './configs/documents';

export default function config() {
  configInvoices(this);
  configLines(this);
  configVendors(this);
  configUnits(this);
  configUsers(this);
  configVouchers(this);
  configVoucherLines(this);
  configDocuments(this);
}
