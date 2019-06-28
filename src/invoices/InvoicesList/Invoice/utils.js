import { get } from 'lodash';

import { STATUS_OPEN } from '../../../common/constants';

// eslint-disable-next-line import/prefer-default-export
export const createInvoiceLineFromPOL = (poLine, invoiceId) => {
  const quantityPhysical = get(poLine, 'cost.quantityPhysical', 0);
  const quantityElectronic = get(poLine, 'cost.quantityElectronic', 0);

  return {
    invoiceId,
    invoiceLineStatus: STATUS_OPEN,
    description: poLine.title,
    poLineId: poLine.id,
    comment: poLine.poLineDescription,
    fundDistributions: poLine.fundDistribution,
    vendorRefNo: get(poLine, 'vendorDetail.refNumber'),
    subscriptionStart: get(poLine, 'details.subscriptionFrom'),
    subscriptionEnd: get(poLine, 'details.subscriptionTo'),
    quantity: quantityElectronic + quantityPhysical,
    subTotal: (
      quantityPhysical * get(poLine, 'cost.listUnitPrice', 0)
      + quantityElectronic * get(poLine, 'cost.quantityElectronic', 0)
    ),
  };
};
