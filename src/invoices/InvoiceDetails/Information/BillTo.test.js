import { render } from '@folio/jest-config-stripes/testing-library/react';
import { useAddress } from '@folio/stripes-acq-components';

import BillTo from './BillTo';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  useAddress: jest.fn(),
}));

const testId = 'testId';
const testAddress = { address: 'testAddress' };

const defaultProps = {
  billToId: testId,
};

const renderBillTo = (props = {}) => render(
  <BillTo
    {...defaultProps}
    {...props}
  />,
);

describe('BillTo component', () => {
  beforeEach(() => {
    useAddress.mockReturnValue({ address: testAddress });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should display address', () => {
    const { getByText } = renderBillTo({ billToId: testId });

    expect(getByText(testAddress.address)).toBeInTheDocument();
  });

  it('should display hyphen instead of address', () => {
    const { getByText } = renderBillTo({ billToId: null });

    expect(getByText('-')).toBeInTheDocument();
  });
});
