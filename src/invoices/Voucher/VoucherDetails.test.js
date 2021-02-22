import React from 'react';
import { render } from '@testing-library/react';

import VoucherDetails from './VoucherDetails';

const testVoucher = {
  accountingCode: '0206',
  status: 'Awaiting payment',
  voucherNumber: 1000,
};

const renderVoucherDetails = (
  voucher,
  enclosureNeeded = false,
) => (render(
  <VoucherDetails
    voucher={voucher}
    enclosureNeeded={enclosureNeeded}
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
});
