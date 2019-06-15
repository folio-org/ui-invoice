import { Factory, faker } from '@bigtest/mirage';

import { PAYMENT_METHOD_CASH } from '../../../../src/invoices/InvoiceForm';

export default Factory.extend({
  id: faker.random.uuid,
  vendorInvoiceNo: faker.random.uuid,
  vendorId: faker.random.uuid,
  invoiceDate: faker.date.past,
  status: 'Open',
  total: () => Number.parseFloat(faker.finance.amount(90, 1000, 2)),
  currency: 'USD',
  approvalDate: faker.date.past,
  paymentMethod: PAYMENT_METHOD_CASH,
});
