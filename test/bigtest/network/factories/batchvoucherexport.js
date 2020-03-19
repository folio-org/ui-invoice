import { Factory } from 'miragejs';
import faker from 'faker';

export default Factory.extend({
  id: faker.random.uuid,
  batchVoucherId: faker.random.uuid,
  batchGroupId: faker.random.uuid,
  end: faker.date.past,
  start: faker.date.past,
  status: () => 'Pending',
  message: faker.random.word,
  metadata: {
    createdDate: faker.date.past,
    updatedDate: faker.date.past,
  },
});
