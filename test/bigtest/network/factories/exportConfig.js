import { Factory } from 'miragejs';
import faker from 'faker';

import { EXPORT_FORMAT } from '../../../../src/settings/BatchGroupConfigurationSettings/constants';

export default Factory.extend({
  id: faker.random.uuid,
  startTime: '00:00',
  enableScheduledExport: true,
  format: EXPORT_FORMAT.xml,
  weekdays: () => [faker.date.weekday()],
  metadata: {
    createdDate: faker.date.past,
    updatedDate: faker.date.past,
  },
});
