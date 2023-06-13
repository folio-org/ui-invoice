import React from 'react';
import { IntlProvider } from 'react-intl';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MemoryRouter } from 'react-router';
import { render, screen, waitFor } from '@testing-library/react';
import user from '@testing-library/user-event';

import { invoiceLine, orderLine } from '../../../../test/jest/fixtures';

import { useOtherRelatedInvoiceLines } from './useOtherRelatedInvoiceLines';
import { OtherRelatedInvoiceLines } from './OtherRelatedInvoiceLines';

jest.mock('./useOtherRelatedInvoiceLines', () => ({
  useOtherRelatedInvoiceLines: jest.fn(),
}));

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  Loading: jest.fn(() => 'Loading'),
}));

const defaultProps = {
  invoiceLine,
  poLine: orderLine,
};

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <MemoryRouter>
    <IntlProvider locale="en">
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </IntlProvider>
  </MemoryRouter>
);

const renderOtherRelatedInvoiceLines = (props = {}) => render(
  <OtherRelatedInvoiceLines
    {...defaultProps}
    {...props}
  />,
  { wrapper },
);

describe('OtherRelatedInvoiceLines', () => {
  beforeEach(() => {
    useOtherRelatedInvoiceLines.mockClear().mockReturnValue({
      isLoading: false,
      invoiceLines: [{}],
    });
  });

  it('should render RelatedInvoiceLines multicolumn list', () => {
    renderOtherRelatedInvoiceLines();

    expect(screen.getByText('ui-invoice.otherRelatedInvoiceLines.invoiceLine')).toBeInTheDocument();
    expect(screen.getByText('ui-invoice.otherRelatedInvoiceLines.invoiceDate')).toBeInTheDocument();
    expect(screen.getByText('ui-invoice.otherRelatedInvoiceLines.vendorInvoiceNo')).toBeInTheDocument();
    expect(screen.getByText('ui-invoice.otherRelatedInvoiceLines.vendorName')).toBeInTheDocument();
    expect(screen.getByText('ui-invoice.otherRelatedInvoiceLines.status')).toBeInTheDocument();
    expect(screen.getByText('ui-invoice.otherRelatedInvoiceLines.quantity')).toBeInTheDocument();
    expect(screen.getByText('ui-invoice.otherRelatedInvoiceLines.amount')).toBeInTheDocument();
    expect(screen.getByText('ui-invoice.otherRelatedInvoiceLines.comment')).toBeInTheDocument();
  });

  it('should render loading', () => {
    useOtherRelatedInvoiceLines.mockClear().mockReturnValue({
      isLoading: true,
    });
    renderOtherRelatedInvoiceLines();
    expect(screen.getByText('Loading')).toBeInTheDocument();
  });

  it('should sort by elements by invoice date onclick header', async () => {
    const { container } = renderOtherRelatedInvoiceLines();
    const sortButton = screen.getByText('ui-invoice.otherRelatedInvoiceLines.invoiceDate');

    user.click(sortButton);

    await waitFor(() => expect(container.querySelector('#list-column-invoicedate').getAttribute('aria-sort')).toBe('descending'));
  });
});
