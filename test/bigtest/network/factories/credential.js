import { Factory } from 'miragejs';
import faker from 'faker';

export default Factory.extend({
  id: faker.random.uuid,
  username: () => faker.internet.userName(),
  password: () => faker.internet.password(8),
  metadata: {
    createdDate: faker.date.past,
    updatedDate: faker.date.past,
  },
});
