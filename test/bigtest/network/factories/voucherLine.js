import { Factory } from 'miragejs';
import faker from 'faker';

export default Factory.extend({
  id: faker.datatype.uuid,
  amount: () => Number.parseFloat(faker.finance.amount(90, 1000, 2)),
  externalAccountNumber: faker.finance.account,
});
