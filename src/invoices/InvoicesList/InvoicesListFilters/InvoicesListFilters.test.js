import { QueryClient, QueryClientProvider } from 'react-query';

import { render } from '@folio/jest-config-stripes/testing-library/react';

import InvoicesListFilters from './InvoicesListFilters';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  FundFilter: 'FundFilter',
  ExpenseClassFilter: 'ExpenseClassFilter',
  NumberRangeFilter: 'NumberRangeFilter',
}));
jest.mock('./BatchGroupFilter', () => ({
  BatchGroupFilter: 'BatchGroupFilter',
}));
jest.mock('./FiscalYearFilter', () => ({
  FiscalYearFilter: 'FiscalYearFilter',
}));

const defaultProps = {
  activeFilters: {},
  applyFilters: jest.fn(),
  disabled: false,
};

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const renderInvoicesListFilters = (props = defaultProps) => render(
  <InvoicesListFilters {...props} />,
  { wrapper },
);

describe('InvoicesListFilters', () => {
  beforeEach(() => {
    global.document.createRange = global.document.originalCreateRange;
  });

  afterEach(() => {
    global.document.createRange = global.document.mockCreateRange;
  });

  it('should render correct structure', async () => {
    const { container, asFragment } = renderInvoicesListFilters();

    container.querySelector('#invoice-filters-accordion-set').removeAttribute('aria-multiselectable');

    expect(asFragment()).toMatchSnapshot();
  });

  it('should render correct structure when disabled', async () => {
    const { container, asFragment } = renderInvoicesListFilters({ ...defaultProps, disabled: true });

    container.querySelector('#invoice-filters-accordion-set').removeAttribute('aria-multiselectable');

    expect(asFragment()).toMatchSnapshot();
  });

  it('should render Total Amount', () => {
    const { container } = renderInvoicesListFilters();

    expect(container.querySelector('#total')).toBeInTheDocument();
  });
});
