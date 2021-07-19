import React from 'react';
import { render, screen } from '@testing-library/react';

import { batchVoucherLine, batchVoucher } from '../../../test/jest/fixtures';

import VoucherView from './VoucherView';

jest.mock('./VoucherDetails', () => jest.fn(() => 'VoucherDetails'));
jest.mock('./VoucherLinesDetails', () => jest.fn(() => 'VoucherLinesDetails'));

const defaultProps = {
  voucher: batchVoucher,
  voucherLines: [batchVoucherLine],
};
const renderVoucherView = (props = defaultProps) => (render(
  <VoucherView {...props} />,
));

describe('VoucherDetails component', () => {
  it('should display voucher details', () => {
    renderVoucherView();

    expect(screen.getByText('VoucherDetails')).toBeDefined();
  });

  it('should display voucher lines', () => {
    renderVoucherView();

    expect(screen.getByText('VoucherLinesDetails')).toBeDefined();
  });
});
