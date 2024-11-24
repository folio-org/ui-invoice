import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import { VersionHistoryView } from './VersionHistoryView';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  useOrderLine: jest.fn().mockReturnValue({ orderLine: { poLineNumber: '1' } }),
}));

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const defaultProps = {
  version: {
    id: 'versionId',
    invoiceId: 'invoiceId',
    total: 10,
    subTotal: 10,
    poLineId: 'poLineId',
  },
};

const renderComponent = (props = defaultProps) => render(
  <VersionHistoryView {...props} />,
  { wrapper },
);

describe('VersionHistoryView', () => {
  it('should render component', () => {
    renderComponent();

    expect(screen.getByText('ui-invoice.invoiceLineInformation')).toBeInTheDocument();
  });

  it('should display adjustments and fundDistributions', () => {
    renderComponent({
      version: {
        id: 'versionId',
        invoiceId: 'invoiceId',
        adjustments: [
          {
            description: 'description',
            value: 10,
          },
        ],
        fundDistributions: [{
          id: 'fundDistributionId',
          amount: 10,
          value: 10,
          expenseClassId: 'expenseClassId',
        }],
      },
    });

    expect(screen.getByText('ui-invoice.invoice.details.accordion.adjustments')).toBeInTheDocument();
    expect(screen.getByText('ui-invoice.fundDistribution')).toBeInTheDocument();
  });
});
