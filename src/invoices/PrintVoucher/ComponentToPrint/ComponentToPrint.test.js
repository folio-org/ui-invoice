import { render } from '@folio/jest-config-stripes/testing-library/react';

import {
  batchGroup,
  batchVoucher,
  batchVoucherLine,
  invoice,
} from '../../../../test/jest/fixtures';

import ComponentToPrint from './ComponentToPrint';

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
const renderComponentToPrint = (props = defaultProps) => render(
  <ComponentToPrint {...props} />,
);

describe('PrintVoucher -> ComponentToPrint', () => {
  beforeEach(() => {
    global.document.createRange = global.document.originalCreateRange;
  });

  afterEach(() => {
    global.document.createRange = global.document.mockCreateRange;
  });

  it('should render correct structure', () => {
    const { asFragment } = renderComponentToPrint();

    expect(asFragment()).toMatchSnapshot();
  });
});
