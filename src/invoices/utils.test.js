import {
  convertToInvoiceLineFields,
  getActiveAccountNumbers,
} from './utils';

const mockAccounts = [
  {
    'name': 'Monographic ordering unit account',
    'accountNo': '1234',
    'description': 'Monographic ordering unit account',
    'appSystemNo': '',
    'paymentMethod': 'Credit Card',
    'accountStatus': 'Active',
    'contactInfo': 'cust.service03@amazon.com',
    'libraryCode': 'COB',
    'libraryEdiCode': '765987610',
    'notes': '',
    'acqUnitIds': [],
  },
  {
    'name': 'Amazon Test account',
    'accountNo': '00000001',
    'description': 'Amazon Test account',
    'accountStatus': 'Inactive',
    'acqUnitIds': [],
  },
  {
    'name': 'Amazon Pending account',
    'accountNo': '00000002',
    'description': 'Amazon Pending account',
    'accountStatus': 'Pending',
    'acqUnitIds': [],
  },
];

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

  describe('getActiveAccountNumbers', () => {
    it('should return active account numbers', () => {
      const initialAccountNumber = mockAccounts[1].accountNo;
      expect(getActiveAccountNumbers({ 
        accounts: mockAccounts, 
        initialAccountNumber, 
      })).toEqual([
        mockAccounts[0].accountNo,
        initialAccountNumber,
      ]);
    });
  });
});
