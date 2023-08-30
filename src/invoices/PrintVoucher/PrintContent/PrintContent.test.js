import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import {
  batchGroup,
  batchVoucher,
  batchVoucherLine,
  invoice,
} from '../../../../test/jest/fixtures';

import PrintContent from './PrintContent';

jest.mock('../ComponentToPrint', () => jest.fn(() => 'ComponentToPrint'));

const defaultProps = {
  dataSource: {
    batchGroup,
    invoice,
    vendor: {
      name: 'Amazon',
      code: 'AMZ',
    },
    voucher: batchVoucher,
    voucherLines: [batchVoucherLine],
  },
};
const renderPrintContent = (props = defaultProps) => render(
  <PrintContent {...props} />,
);

describe('PrintVoucher -> PrintContent', () => {
  it('should display ComponentToPrint when dataSource is defined', () => {
    renderPrintContent();

    expect(screen.getByText('ComponentToPrint')).toBeDefined();
  });

  it('should not display ComponentToPrint when dataSource is not defined', () => {
    renderPrintContent({});

    expect(screen.queryByText('ComponentToPrint')).toBeNull();
  });
});
