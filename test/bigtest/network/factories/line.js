import { Factory, faker } from '@bigtest/mirage';

import { INVOICE_STATUS } from '../../../../src/common/constants';

export default Factory.extend({
  id: faker.random.uuid,
  invoiceLineNumber: faker.random.uuid,
  poLineId: faker.random.uuid,
  invoiceId: faker.random.uuid,
  description: faker.lorem.sentence(),
  invoiceLineStatus: INVOICE_STATUS.open,
  subTotal: faker.commerce.price,
  quantity: (i) => i + 1,
  fundDistributions: [{
    code: 'USHIST',
    encumbrance: '1c8fc9f4-d2cc-4bd1-aa9a-cb02291cbe65',
    fundId: '1d1574f1-9196-4a57-8d1f-3b2e4309eb81',
    percentage: 50,
  }],
});
