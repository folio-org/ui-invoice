import { Factory } from 'miragejs';
import faker from 'faker';

export default Factory.extend({
  id: faker.random.uuid,
  accountingCode: faker.finance.account,
  amount: () => Number.parseFloat(faker.finance.amount(90, 1000, 2)),
  invoiceCurrency: 'USD',
  disbursementDate: faker.date.past,
  voucherDate: faker.date.past,
  disbursementAmount: () => Number.parseFloat(faker.finance.amount(1, 100, 2)),
  voucherNumber: faker.finance.account,
});
