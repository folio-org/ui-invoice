import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import { VersionHistoryView } from './VersionHistoryView';

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

    expect(screen.getByText('ui-invoice.invoice.details.information.title')).toBeInTheDocument();
  });

  it('should display adjustments and poLines', () => {
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
        poNumbers: ['PO-1'],
      },
    });

    expect(screen.getByText('ui-invoice.invoice.details.accordion.adjustments')).toBeInTheDocument();
    expect(screen.getByText('ui-invoice.invoice.details.lines.title')).toBeInTheDocument();
  });
});
