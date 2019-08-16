import { Factory, faker } from '@bigtest/mirage';

export default Factory.extend({
  id: faker.random.uuid,
  amount: () => Number.parseFloat(faker.finance.amount(90, 1000, 2)),
  externalAccountNumber: faker.finance.account,
});
