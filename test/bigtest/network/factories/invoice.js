import { Factory, faker } from '@bigtest/mirage';

export default Factory.extend({
  id: faker.random.uuid,
  vendorInvoiceNo: faker.random.alphaNumeric,
  vendorId: faker.random.uuid,
  invoiceDate: faker.date.past,
  status: 'Approved',
  total: faker.finance.amount,
});
