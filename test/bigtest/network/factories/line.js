import { Factory, faker } from '@bigtest/mirage';

export default Factory.extend({
  id: faker.random.uuid,
  invoiceLineNumber: faker.random.uuid,
  poLineId: faker.random.uuid,
  invoiceId: faker.random.uuid,
});
