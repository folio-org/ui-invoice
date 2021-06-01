import {
  convertToInvoiceLineFields,
} from './utils';

describe('Invoice utils', () => {
  describe('convertToInvoiceLineFields', () => {
    const poLine = {
      cost: {
        quantityPhysical: 3,
        quantityElectronic: 4,
        poLineEstimatedPrice: 20,
      },
      vendorDetail: {
        vendorAccount: 'GE45-3432-23',
        referenceNumbers: ['32-42'],
      },
      titleOrPackage: 'ABA',
      comment: 'Test is passed',
      fundDistributions: [],
    };

    it('should return invoice line fields based on order line', () => {
      expect(convertToInvoiceLineFields(poLine)).toEqual({
        description: poLine.titleOrPackage,
        comment: poLine.poLineDescription,
        fundDistributions: poLine.fundDistribution,
        referenceNumbers: poLine.vendorDetail.referenceNumbers,
        subscriptionStart: undefined,
        subscriptionEnd: undefined,
        quantity: poLine.cost.quantityPhysical + poLine.cost.quantityElectronic,
        subTotal: poLine.cost.poLineEstimatedPrice,
        accountNumber: poLine.vendorDetail.vendorAccount,
      });
    });
  });
});
