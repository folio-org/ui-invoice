import { Factory } from 'miragejs';
import faker from 'faker';

export default Factory.extend({
  documentMetadata: {
    id: faker.random.uuid,
    name: faker.system.fileName,
    invoiceId: faker.random.uuid,
  },
});
