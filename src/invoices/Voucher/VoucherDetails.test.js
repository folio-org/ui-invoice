import React from 'react';
import { render } from '@testing-library/react';

import VoucherDetails from './VoucherDetails';
import { useDefaultAccountingCode } from '../../common/hooks';

const testVoucher = {
  accountNo: 'accountNo',
  accountingCode: '0206',
  status: 'Awaiting payment',
  voucherNumber: 1000,
  enclosureNeeded: false,
};

jest.mock('../../common/hooks', () => ({
  useDefaultAccountingCode: jest.fn().mockReturnValue({ isLoading: false }),
}));

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  Loading: jest.fn(() => <div>Loading</div>),
}));

const renderVoucherDetails = (
  voucher,
) => (render(
  <VoucherDetails
    voucher={voucher}
  />,
));

describe('VoucherDetails component', () => {
  it('should display voucher details', () => {
    useDefaultAccountingCode.mockReturnValue({ isLoading: false, accountNo: testVoucher.accountNo });
    const { getByText } = renderVoucherDetails(testVoucher);

    expect(getByText(testVoucher.accountingCode)).toBeDefined();
    expect(getByText(testVoucher.voucherNumber)).toBeDefined();
    expect(getByText('ui-invoice.voucher.status.awaitingPayment')).toBeDefined();
    expect(getByText('ui-invoice.invoice.enclosureNeeded')).toBeDefined();
    expect(getByText(testVoucher.accountNo)).toBeDefined();
  });

  it('should display Loading component', () => {
    useDefaultAccountingCode.mockReturnValue({ isLoading: true });
    const { getByText } = renderVoucherDetails(testVoucher);

    expect(getByText('Loading')).toBeDefined();
  });
});
