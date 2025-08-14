import { MemoryRouter } from 'react-router-dom';

import { render } from '@folio/jest-config-stripes/testing-library/react';

import {
  orderLine,
  invoiceLine,
} from 'fixtures';
import { useExchangeCalculation } from '../../common/hooks';
import InvoiceLineInformation from './InvoiceLineInformation';

jest.mock('@folio/stripes-components/lib/NoValue', () => () => <span>-</span>);

jest.mock('../../common/hooks', () => ({
  ...jest.requireActual('../../common/hooks'),
  useExchangeCalculation: jest.fn(),
}));

const defaultProps = {
  currency: 'USD',
  exchangeRate: 1,
  invoiceLine,
  poLine: orderLine,
};
const renderInvoiceLineInformation = (props = defaultProps) => (render(
  <InvoiceLineInformation {...props} />,
  { wrapper: MemoryRouter },
));

describe('InvoiceLineInformation', () => {
  beforeEach(() => {
    useExchangeCalculation.mockReturnValue({
      exchangedAmount: 100,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should display info invoice line connected to order line', () => {
    const { asFragment } = renderInvoiceLineInformation();

    expect(asFragment()).toMatchSnapshot();
  });

  it('should display info invoice line not connected to order line', () => {
    const { asFragment } = renderInvoiceLineInformation({
      ...defaultProps,
      poLine: {},
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
