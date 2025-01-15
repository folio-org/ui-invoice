/* Developed collaboratively using AI (Chat GPT) */

import { QueryClient, QueryClientProvider } from 'react-query';
import { render, fireEvent } from '@folio/jest-config-stripes/testing-library/react';

import InvoicesListFilters from './InvoicesListFilters';
import { FILTERS } from '../constants';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  FundFilter: 'FundFilter',
  ExpenseClassFilter: 'ExpenseClassFilter',
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

  it('should render Total Amount filter', () => {
    const { container } = renderInvoicesListFilters();

    const totalAmountFilter = container.querySelector(`#${FILTERS.TOTAL_AMOUNT}`);

    expect(totalAmountFilter).toBeInTheDocument();
  });

  it('should call applyFilters when Total Amount changes', () => {
    const adaptedApplyFilters = jest.fn();
    const { container } = renderInvoicesListFilters({
      ...defaultProps,
      applyFilters: adaptedApplyFilters,
      activeFilters: { [FILTERS.TOTAL_AMOUNT]: '' },
    });

    const inputs = container.querySelectorAll('section#total input[type="number"]');
    const fromInput = inputs[0];
    const toInput = inputs[1];
    const applyButton = container.querySelector('section#total [data-test-apply-button]');

    fireEvent.change(fromInput, { target: { value: '50' } });
    fireEvent.change(toInput, { target: { value: '100' } });

    fireEvent.click(applyButton);

    expect(adaptedApplyFilters).toHaveBeenCalledWith(FILTERS.TOTAL_AMOUNT, ['50-100']);
  });
});
