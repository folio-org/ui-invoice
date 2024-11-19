import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import { invoiceLine, orderLine, vendor } from 'fixtures';
import {
  useOrderLines,
  useVendors,
} from '../../../../common/hooks';
import {
  useInvoiceLinesByInvoiceId,
  useOrdersByPoNumbers,
} from '../hooks';

import { VersionHistoryViewInvoiceLine } from './VersionHistoryViewInvoiceLine';

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  Loading: jest.fn(() => 'Loading'),
}));

jest.mock('../../../../common/hooks', () => ({
  ...jest.requireActual('../../../../common/hooks'),
  useOrderLines: jest.fn(() => ({})),
  useVendors: jest.fn(() => ({})),
}));
jest.mock('../hooks', () => ({
  ...jest.requireActual('../hooks'),
  useInvoiceLinesByInvoiceId: jest.fn(() => ({})),
  useOrdersByPoNumbers: jest.fn(() => ({})),
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
    poNumbers: ['PO-1'],
  },
};

const order = {
  'id': '9c236654-9bfb-4acb-8007-d7e8fb4e5ec7',
  'approved': true,
  'billTo': '5f8a321e-6b38-4d90-92d4-bf08f91a2242',
  'manualPo': false,
  'notes': [
    'Check credit card statement to make sure payment shows up',
  ],
  'poNumber': 'pref10000',
  'poNumberPrefix': 'pref',
  'orderType': 'One-Time',
  'reEncumber': false,
  'shipTo': 'f7c36792-05f7-4c8c-969d-103ac6763187',
  'template': '4dee318b-f5b3-40dc-be93-cc89b8c45b6f',
  'vendor': 'e0fb5df2-cdf1-11e8-a8d5-f2801f1b9fd1',
  'workflowStatus': 'Pending',
  'acqUnitIds': [],
  'nextPolNumber': 2,
  'tags': {
    'tagList': [
      'amazon',
    ],
  },
};

const renderComponent = (props = defaultProps) => render(
  <VersionHistoryViewInvoiceLine {...props} />,
  { wrapper },
);

describe('VersionHistoryViewInvoiceLine', () => {
  beforeEach(() => {
    useOrderLines.mockClear().mockReturnValue({
      isLoading: false,
      orderLines: [orderLine],
    });
    useVendors.mockClear().mockReturnValue({
      isLoading: false,
      vendors: [vendor],
    });
    useInvoiceLinesByInvoiceId.mockClear().mockReturnValue({
      isLoading: false,
      invoiceLines: [invoiceLine],
    });
    useOrdersByPoNumbers.mockClear().mockReturnValue({
      isLoading: false,
      orders: [order],
    });
  });

  it('should display Loading component', () => {
    useInvoiceLinesByInvoiceId.mockReturnValueOnce({
      isLoading: true,
    });

    renderComponent();

    expect(screen.getByText('Loading')).toBeInTheDocument();
  });

  it('should display invoice line description', () => {
    renderComponent();

    expect(screen.getByText(invoiceLine.description)).toBeInTheDocument();
  });
});
