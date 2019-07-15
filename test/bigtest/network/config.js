import configInvoices from './configs/invoices';
import configLines from './configs/lines';
import configVendors from './configs/vendors';
import configUnits from './configs/units';

export default function config() {
  configInvoices(this);
  configLines(this);
  configVendors(this);
  configUnits(this);
}
