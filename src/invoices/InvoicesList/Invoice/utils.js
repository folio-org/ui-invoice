import { find, get } from 'lodash';

import { INVOICE_STATUS } from '../../../common/constants';
import { getAdjustmentFromPreset } from '../../utils';

// eslint-disable-next-line import/prefer-default-export
export const createInvoiceLineFromPOL = (poLine, invoiceId, vendor) => {
  const quantityPhysical = get(poLine, 'cost.quantityPhysical', 0);
  const quantityElectronic = get(poLine, 'cost.quantityElectronic', 0);
  const accountNumber = get(poLine, 'vendorDetail.vendorAccount');
  const optionalProps = {};

  if (accountNumber) {
    const accounts = get(vendor, 'accounts', []);
    const account = find(accounts, { accountNo: accountNumber });
    const accountingCode = get(account, 'appSystemNo') || get(vendor, 'erpCode');

    optionalProps.accountNumber = accountNumber;
    if (accountingCode) {
      optionalProps.accountingCode = accountingCode;
    }
  }

  return {
    invoiceId,
    invoiceLineStatus: INVOICE_STATUS.open,
    description: poLine.titleOrPackage,
    poLineId: poLine.id,
    comment: poLine.poLineDescription,
    fundDistributions: poLine.fundDistribution,
    vendorRefNo: get(poLine, 'vendorDetail.refNumber'),
    subscriptionStart: get(poLine, 'details.subscriptionFrom'),
    subscriptionEnd: get(poLine, 'details.subscriptionTo'),
    quantity: quantityElectronic + quantityPhysical,
    subTotal: poLine?.cost?.poLineEstimatedPrice || 0,
    ...optionalProps,
  };
};

export const getAlwaysShownAdjustmentsList = (adjustments) => (
  adjustments.filter(({ adjustment }) => adjustment.alwaysShow).map(({ adjustment }) => {
    return getAdjustmentFromPreset(adjustment);
  })
);
