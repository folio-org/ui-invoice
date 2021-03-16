import React from 'react';
import { render } from '@testing-library/react';

import VoucherDetails from './VoucherDetails';

const testVoucher = {
  accountingCode: '0206',
  status: 'Awaiting payment',
  voucherNumber: 1000,
  enclosureNeeded: false,
};

const renderVoucherDetails = (
  voucher,
) => (render(
  <VoucherDetails
    voucher={voucher}
  />,
));

describe('VoucherDetails component', () => {
  it('should display voucher details', () => {
    const { getByText } = renderVoucherDetails(testVoucher);

    expect(getByText(testVoucher.accountingCode)).toBeDefined();
    expect(getByText(testVoucher.voucherNumber)).toBeDefined();
    expect(getByText(testVoucher.status)).toBeDefined();
    expect(getByText('ui-invoice.invoice.enclosureNeeded')).toBeDefined();
  });

  it('should display No account in voucher details', () => {
    const { getByText } = renderVoucherDetails(testVoucher);

    expect(getByText('ui-invoice.invoice.details.voucher.noAccount')).toBeDefined();
  });

  it('should display account number in voucher details', () => {
    const accountNo = 'accountNo';
    const { getByText } = renderVoucherDetails({ ...testVoucher, accountNo });

    expect(getByText(accountNo)).toBeDefined();
  });
});
