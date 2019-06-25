import { Factory, faker } from '@bigtest/mirage';
import { ORGANIZATION_STATUS_ACTIVE } from '../../../../src/common/constants';

export default Factory.extend({
  id: faker.random.uuid,
  name: faker.company.companyName,
  code: faker.random.word,
  isVendor: true,
  status: ORGANIZATION_STATUS_ACTIVE,
});
