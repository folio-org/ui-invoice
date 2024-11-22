import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import {
  MemoryRouter,
  Route,
  Switch,
  withRouter,
} from 'react-router-dom';

import user from '@folio/jest-config-stripes/testing-library/user-event';
import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { invoice } from 'fixtures';

import {
  AUDIT_INVOICE_API,
  INVOICE_ROUTE,
  INVOICE_VERSION_HISTORY_ROUTE,
} from '../../common/constants';
import { useInvoiceVersions } from '../../common/hooks';
import InvoiceLineVersionHistory from './InvoiceLineVersionHistory';

jest.mock('../../common/hooks', () => ({
  ...jest.requireActual('../../common/hooks'),
  useInvoiceVersions: jest.fn(() => {}),
}));

const auditEvent = {
  'id': '037cab35-9a01-4d9f-88b4-e5bcdf3e1efb',
  'total': 5,
  'source': 'User',
  'status': 'Paid',
  'currency': 'USD',
  'subTotal': 5,
  'invoiceDate': '2024-11-12T00:00:00.000+00:00',
  'paymentDate': '2024-11-12T08:23:22.241+00:00',
  'paymentMethod': 'Credit Card',
};

const latestSnapshot = {
  ...auditEvent,
  total: 10,
  subTotal: 10,
};

const versions = [
  {
    id: 'testAuditEventId',
    invoiceSnapshot: { map: latestSnapshot },
  },
  {
    ...auditEvent,
    invoiceSnapshot: { map: auditEvent },
  },
];

const kyMock = {
  get: jest.fn((url) => ({
    json: async () => {
      const result = {};

      if (url.startsWith(AUDIT_INVOICE_API)) {
        result.invoiceAuditEvents = versions;
      }

      return Promise.resolve({
        isLoading: false,
        ...result,
      });
    },
  })),
};

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <MemoryRouter
      initialEntries={[{
        pathname: `${INVOICE_ROUTE}/view/${invoice.id}/versions`,
      }]}
    >
      {children}
    </MemoryRouter>
  </QueryClientProvider>
);

const Component = withRouter(InvoiceLineVersionHistory);
const mockDefaultContent = 'Hello world';

const renderComponent = (props = {}) => render(
  <Switch>
    <Route
      exact
      path={INVOICE_VERSION_HISTORY_ROUTE}
      render={() => (
        <Component
          {...props}
        />
      )}
    />
    <Route
      render={() => (
        <div>{mockDefaultContent}</div>
      )}
    />
  </Switch>,
  { wrapper },
);

describe('InvoiceLineVersionHistory', () => {
  beforeEach(() => {
    kyMock.get.mockClear();
    useOkapiKy.mockClear().mockReturnValue(kyMock);
    useInvoiceVersions.mockClear().mockReturnValue({
      isLoading: false,
      versions,
    });
  });

  it('should display Invoice version details', async () => {
    renderComponent();

    const versionBtns = await screen.findAllByRole('button', { name: 'stripes-acq-components.versionHistory.card.select.tooltip' });

    await user.click(versionBtns[0]);

    expect(screen.queryByText('ui-invoice.invoice.details.paneTitle')).toBeInTheDocument();
  });

  it('should close version view when \'Version close\' button was clicked', async () => {
    renderComponent();

    await screen.findAllByRole('button', { name: 'stripes-acq-components.versionHistory.card.select.tooltip' })
      .then(async ([selectVersionBtn]) => user.click(selectVersionBtn));

    await screen.findAllByRole('button', { name: 'stripes-components.closeItem' })
      .then(async ([closeVersionBtn]) => user.click(closeVersionBtn));

    expect(screen.queryByText('ui-invoice.invoice.details.paneTitle')).not.toBeInTheDocument();
    expect(screen.getByText(mockDefaultContent)).toBeInTheDocument();
  });
});
