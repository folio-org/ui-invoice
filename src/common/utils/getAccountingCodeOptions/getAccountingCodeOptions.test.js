import { vendor as vendorStub } from '../../../../test/jest/fixtures';
import {
  getAccountingCodeOptions,
  NO_ACCOUNT_NUMBER,
} from './getAccountingCodeOptions';

const accounts = [
  {
    name: 'Monographic ordering unit account',
    accountNo: '1234',
    appSystemNo: 'qwerty',
    description: 'Monographic ordering unit account',
    paymentMethod: 'Credit Card',
    accountStatus: 'Active',
    contactInfo: 'cust.service03@amazon.com',
    libraryCode: 'COB',
    libraryEdiCode: '765987610',
    acqUnitIds: [],
  },
  {
    name: 'Test account with "appSystemNo"',
    accountNo: '4321',
    appSystemNo: 'ytrewq',
    accountStatus: 'Active',
    acqUnitIds: [],
  },
  {
    name: 'Test account without "appSystemNo"',
    accountNo: '4321',
    accountStatus: 'Active',
    acqUnitIds: [],
  },
];

const intl = {
  formatMessage: jest.fn((_id, values) => `Default (${values.erpCode})`),
};

describe('getAccountingCodeOptions', () => {
  it('should populate options list with default option if the vendor has ERP code', () => {
    const erpCode = 'G64758-74834';
    const vendor = {
      ...vendorStub,
      erpCode,
    };

    // Default option have __NO_ACCOUNT_NUMBER__ value
    expect(getAccountingCodeOptions(vendor, intl)).toEqual([{
      label: `Default (${erpCode})`,
      value: NO_ACCOUNT_NUMBER,
    }]);
  });

  it('should return a list of options for \'Accounting code\' based on the vendor accounts', () => {
    const vendor = {
      ...vendorStub,
      accounts,
    };

    expect(getAccountingCodeOptions(vendor, intl)).toEqual(
      [accounts[0], accounts[1]].map(({ accountNo, appSystemNo }) => ({
        label: `${accountNo} (${appSystemNo})`,
        value: accountNo,
      })),
    );
  });

  it('should return empty list if the vendor does not have any accounts or ERP code', () => {
    expect(getAccountingCodeOptions(vendorStub, intl)).toEqual([]);
  });
});
