import configInvoices from './configs/invoices';
import configLines from './configs/lines';
import configVendors from './configs/vendors';

export default function config() {
  configInvoices(this);
  configLines(this);
  configVendors(this);
}
