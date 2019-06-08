import configInvoices from './configs/invoices';
import configVendors from './configs/vendors';

export default function config() {
  configInvoices(this);
  configVendors(this);
}
