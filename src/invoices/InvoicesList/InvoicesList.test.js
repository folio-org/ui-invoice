import { QueryClient, QueryClientProvider } from 'react-query';
import { MemoryRouter, useHistory, useLocation } from 'react-router-dom';

import user from '@folio/jest-config-stripes/testing-library/user-event';
import { act, render } from '@folio/jest-config-stripes/testing-library/react';
import { HasCommand } from '@folio/stripes/components';

import { invoice, location } from '../../../test/jest/fixtures';

import InvoicesList from './InvoicesList';

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useLocation: jest.fn(),
  useHistory: jest.fn(),
}));
jest.mock('react-virtualized-auto-sizer', () => jest.fn(
  (props) => <div>{props.children({ width: 123 })}</div>,
));
jest.mock('@folio/stripes/smart-components', () => ({
  ...jest.requireActual('@folio/stripes/smart-components'),
  // eslint-disable-next-line react/prop-types
  PersistedPaneset: (props) => <div>{props.children}</div>,
}));
jest.mock('@folio/stripes-components/lib/Commander', () => ({
  HasCommand: jest.fn(({ children }) => <div>{children}</div>),
}));
jest.mock('@folio/stripes-acq-components', () => {
  return {
    ...jest.requireActual('@folio/stripes-acq-components'),
    useFiltersToogle: jest.fn().mockReturnValue({ isFiltersOpened: true, toggleFilters: jest.fn() }),
    ResetButton: () => <span>ResetButton</span>,
    SingleSearchForm: () => <span>SingleSearchForm</span>,
    useItemToView: () => ({}),
    useLocationFilters: () => ([]),
    useFunds: () => ([]),
  };
});

jest.mock('./InvoicesListFilters', () => jest.fn().mockReturnValue('InvoicesListFilters'));

const defaultProps = {
  onNeedMoreData: jest.fn(),
  resetData: jest.fn(),
  refreshList: jest.fn(),
  invoicesCount: 1,
  invoices: [invoice],
  isLoading: false,
};

const queryClient = new QueryClient();
// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <MemoryRouter>
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  </MemoryRouter>
);

const renderInvoicesList = (props = defaultProps) => render(
  <InvoicesList {...props} />,
  { wrapper },
);

describe('InvoicesList', () => {
  beforeEach(() => {
    useLocation.mockClear().mockReturnValue(location);
  });

  describe('Filters section', () => {
    it('should display search control', () => {
      const { getByText } = renderInvoicesList();

      expect(getByText('SingleSearchForm')).toBeDefined();
    });

    it('should display reset filters control', () => {
      const { getByText } = renderInvoicesList();

      expect(getByText('ResetButton')).toBeDefined();
    });

    it('should display org filters', () => {
      const { getByText } = renderInvoicesList();

      expect(getByText('InvoicesListFilters')).toBeDefined();
    });

    it('should display org result list', async () => {
      const { getByText } = renderInvoicesList();

      await act(async () => user.click(getByText(defaultProps.invoices[0].vendorInvoiceNo)));

      expect(getByText('ui-invoice.invoice.list.vendorInvoiceNo')).toBeInTheDocument();
      expect(getByText('ui-invoice.invoice.list.vendor')).toBeInTheDocument();
      expect(getByText('ui-invoice.invoice.list.invoiceDate')).toBeInTheDocument();
    });
  });

  describe('Shortcuts', () => {
    beforeEach(() => {
      HasCommand.mockClear();
    });

    it('should navigate to form when new shortcut is called', () => {
      const pushMock = jest.fn();

      useHistory.mockClear().mockReturnValue({
        push: pushMock,
      });

      renderInvoicesList();
      HasCommand.mock.calls[0][0].commands.find(c => c.name === 'new').handler();

      expect(pushMock).toHaveBeenCalledWith('/invoice/create');
    });
  });
});
