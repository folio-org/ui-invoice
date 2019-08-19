import { Factory, faker } from '@bigtest/mirage';

export default Factory.extend({
  documentMetadata: {
    id: faker.random.uuid,
    name: faker.system.fileName,
    invoiceId: faker.random.uuid,
  },
});
