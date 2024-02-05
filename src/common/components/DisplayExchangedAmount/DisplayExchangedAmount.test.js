import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import { useExchangeCalculation } from '../../hooks';
import { DisplayExchangedAmount } from './DisplayExchangedAmount';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  AmountWithCurrencyField: jest.fn(() => 'AmountWithCurrencyField'),
}));
jest.mock('../../hooks', () => ({
  ...jest.requireActual('../../hooks'),
  useExchangeCalculation: jest.fn(),
}));

const renderComponent = (props = {}) => render(
  <DisplayExchangedAmount {...props} />,
);

describe('DisplayExchangedAmount', () => {
  beforeEach(() => {
    useExchangeCalculation.mockClear().mockReturnValue({
      isLoading: false,
      exchangedAmount: 30,
    });
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
