import { IntlProvider } from 'react-intl';
import { QueryClient, QueryClientProvider } from 'react-query';

import { render } from '@folio/jest-config-stripes/testing-library/react';

import Information from './Information';

jest.mock('../../../common/hooks', () => ({
  ...jest.requireActual('../../../common/hooks'),
  useFiscalYear: jest.fn(() => ({ fiscalYear: { code: 'FY2023' } })),
  useExchangeCalculation: jest.fn(() => ({ isLoading: false, exchangedAmount: 30 })),
}));
jest.mock('../BatchGroupValue', () => {
  return () => <span>BatchGroupValue</span>;
});

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const invoiceInformation = {
  batchGroupId: 'cd592659-77aa-4eb3-ac34-c9a4657bb20f',
  invoiceDate: '2020-12-09T00:00:00.000+0000',
  status: 'Open',
  source: 'User',
  currency: 'USD',
};

const renderInformation = ({
  batchGroupId,
  invoiceDate,
  status,
  source,
  currency,
  lockTotal,
}) => render(
  <IntlProvider locale="en">
    <Information
      batchGroupId={batchGroupId}
      invoiceDate={invoiceDate}
      status={status}
      source={source}
      currency={currency}
      lockTotal={lockTotal}
    />
  </IntlProvider>,
  { wrapper },
);

describe('Information component', () => {
  it('should display invoice information', () => {
    const { getByText } = renderInformation(invoiceInformation);

    expect(getByText('stripes-acq-components.sources.user')).toBeDefined();
    expect(getByText('ui-invoice.invoice.status.open')).toBeDefined();
    expect(getByText('2020-12-09')).toBeDefined();
    expect(getByText('FY2023')).toBeInTheDocument();
  });

  it('should not display lock total amount', () => {
    const { queryByTestId } = renderInformation(invoiceInformation);

    expect(queryByTestId('lock-total-amount')).toEqual(null);
  });

  it('should display lock total amount', () => {
    const { getByText } = renderInformation({ ...invoiceInformation, lockTotal: 10 });

    expect(getByText('$10.00')).toBeDefined();
    expect(getByText('ui-invoice.invoice.lockTotalAmount')).toBeDefined();
  });
});
