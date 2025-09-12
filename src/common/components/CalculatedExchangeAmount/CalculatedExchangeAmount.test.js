import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import { useExchangeCalculation } from '@folio/stripes-acq-components';

import { CalculatedExchangeAmount } from './CalculatedExchangeAmount';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  AmountWithCurrencyField: jest.fn(() => 'AmountWithCurrencyField'),
  useExchangeCalculation: jest.fn(),
}));

const renderComponent = (props = {}) => render(
  <CalculatedExchangeAmount {...props} />,
);

describe('CalculatedExchangeAmount', () => {
  beforeEach(() => {
    useExchangeCalculation.mockReturnValue({
      isLoading: false,
      exchangedAmount: 30,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should not render component', async () => {
    renderComponent({
      currency: 'USD',
      exchangeRate: 1,
      total: 30,
    });

    expect(screen.queryByText(/30/)).not.toBeInTheDocument();
  });

  it('should render calculated exchange amount', async () => {
    renderComponent({
      currency: 'EUR',
      exchangeRate: 1,
      total: 30,
    });

    expect(screen.getByText('ui-invoice.invoice.details.information.calculatedTotalExchangeAmount')).toBeInTheDocument();
  });
});
