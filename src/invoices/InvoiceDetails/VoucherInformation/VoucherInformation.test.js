import { render } from '@folio/jest-config-stripes/testing-library/react';

import { batchVoucher, batchVoucherLine } from '../../../../test/jest/fixtures';

import VoucherInformation from './VoucherInformation';

jest.mock('../../Voucher/VoucherDetails', () => jest.fn().mockReturnValue('VoucherDetails'));

const defaultProps = {
  voucher: batchVoucher,
  voucherLines: [batchVoucherLine],
};
const renderVoucherInformation = (props = defaultProps) => render(
  <VoucherInformation {...props} />,
);

describe('VoucherInformation', () => {
  beforeEach(() => {
    global.document.createRange = global.document.originalCreateRange;
  });

  afterEach(() => {
    global.document.createRange = global.document.mockCreateRange;
  });

  it('should render correct structure for invoice voucher info', () => {
    const { asFragment } = renderVoucherInformation();

    expect(asFragment()).toMatchSnapshot();
  });
});
