import { MemoryRouter } from 'react-router-dom';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import { batchVoucher, batchVoucherLine, location } from '../../../../test/jest/fixtures';

import { VoucherInformationContainer } from './VoucherInformationContainer';

jest.mock('./VoucherInformation', () => jest.fn().mockReturnValue('VoucherInformation'));

const defaultProps = {
  invoiceId: 'invoiceId',
  mutator: {
    voucher: {
      reset: jest.fn(),
      GET: jest.fn().mockReturnValue(Promise.resolve([batchVoucher])),
    },
    voucherLines: {
      reset: jest.fn(),
      GET: jest.fn().mockReturnValue(Promise.resolve([batchVoucherLine])),
    },
  },
  resources: {
    voucher: {
      hasLoaded: true,
      records: [batchVoucher],
    },
    voucherLines: {
      hasLoaded: true,
      records: [batchVoucherLine],
    },
  },
  location,
};
const renderVoucherInformationContainer = (props = defaultProps) => render(
  <VoucherInformationContainer {...props} />,
  { wrapper: MemoryRouter },
);

describe('VoucherInformationContainer', () => {
  it('should display VoucherInformation when voucher is loaded', () => {
    renderVoucherInformationContainer();

    expect(screen.getByText('VoucherInformation')).toBeDefined();
  });

  it('should not display VoucherInformation when voucher is not loaded', () => {
    renderVoucherInformationContainer({
      ...defaultProps,
      resources: {
        ...defaultProps.resources,
        voucher: { hasLoaded: false },
      },
    });

    expect(screen.queryByText('VoucherInformation')).toBeNull();
  });

  it('should load voucher', () => {
    renderVoucherInformationContainer();

    expect(defaultProps.mutator.voucher.GET).toHaveBeenCalled();
  });

  it('should load voucher lines when voucher is loaded', () => {
    renderVoucherInformationContainer();

    expect(defaultProps.mutator.voucherLines.GET).toHaveBeenCalled();
  });
});
