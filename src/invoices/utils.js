import { find } from 'lodash';

export const getAdjustmentFromPreset = ({
  description,
  prorate,
  relationToTotal,
  type,
  defaultAmount,
  exportToAccounting,
}) => ({
  description,
  prorate,
  relationToTotal,
  type,
  value: defaultAmount,
  exportToAccounting,
});

export const convertToInvoiceLineFields = (orderLine, vendor) => {
  const quantityPhysical = orderLine.cost?.quantityPhysical ?? 0;
  const quantityElectronic = orderLine.cost?.quantityElectronic ?? 0;
  const accountNumber = orderLine.vendorDetail?.vendorAccount;
  const optionalProps = {};

  if (accountNumber) {
    const accounts = vendor?.accounts ?? [];
    const account = find(accounts, { accountNo: accountNumber });
    const accountingCode = account?.appSystemNo || vendor?.erpCode;

    optionalProps.accountNumber = accountNumber;
    if (accountingCode) {
      optionalProps.accountingCode = accountingCode;
    }
  }

  return {
    description: orderLine.titleOrPackage,
    comment: orderLine.poLineDescription,
    fundDistributions: orderLine.fundDistribution,
    referenceNumbers: orderLine.vendorDetail?.referenceNumbers,
    subscriptionStart: orderLine.details?.subscriptionFrom,
    subscriptionEnd: orderLine.details?.subscriptionTo,
    quantity: quantityElectronic + quantityPhysical,
    subTotal: orderLine.cost?.poLineEstimatedPrice ?? 0,
    ...optionalProps,
  };
};
