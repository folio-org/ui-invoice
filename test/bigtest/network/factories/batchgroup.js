import { Factory } from 'miragejs';
import faker from 'faker';

export default Factory.extend({
  id: faker.random.uuid,
  name: faker.random.word,
  description: faker.random.word,
  metadata: {
    createdDate: faker.date.past,
    updatedDate: faker.date.past,
  },
});
