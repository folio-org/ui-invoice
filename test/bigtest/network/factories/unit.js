import { Factory, faker } from '@bigtest/mirage';

export default Factory.extend({
  id: faker.random.uuid,
  name: faker.finance.accountName,
  protectCreate: () => faker.random.arrayElement([true, false]),
  protectRead: () => faker.random.arrayElement([true, false]),
  protectUpdate: () => faker.random.arrayElement([true, false]),
  protectDelete: () => faker.random.arrayElement([true, false]),
});
