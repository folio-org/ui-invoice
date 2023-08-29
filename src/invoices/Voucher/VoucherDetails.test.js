import { render } from '@folio/jest-config-stripes/testing-library/react';

import VoucherDetails from './VoucherDetails';

const testVoucher = {
  accountNo: 'accountNo',
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
    expect(getByText('ui-invoice.voucher.status.awaitingPayment')).toBeDefined();
    expect(getByText('ui-invoice.invoice.enclosureNeeded')).toBeDefined();
    expect(getByText(testVoucher.accountNo)).toBeDefined();
  });
});
