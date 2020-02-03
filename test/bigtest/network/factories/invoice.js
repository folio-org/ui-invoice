import { Factory } from 'miragejs';
import faker from 'faker';

import { PAYMENT_METHOD } from '@folio/stripes-acq-components';

import { INVOICE_STATUS } from '../../../../src/common/constants';

export default Factory.extend({
  id: faker.random.uuid,
  vendorInvoiceNo: faker.random.uuid,
  vendorId: faker.random.uuid,
  invoiceDate: faker.date.past,
  status: INVOICE_STATUS.open,
  total: () => Number.parseFloat(faker.finance.amount(90, 1000, 2)),
  currency: 'USD',
  approvalDate: faker.date.past,
  paymentMethod: PAYMENT_METHOD.cash,
  adjustments: [],
});
