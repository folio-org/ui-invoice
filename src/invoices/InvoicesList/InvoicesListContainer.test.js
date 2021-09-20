import React from 'react';
import { render, screen, act } from '@testing-library/react';

import { location, invoice } from '../../../test/jest/fixtures';
import { useInvoices } from './hooks';
import InvoicesList from './InvoicesList';
import InvoicesListContainer from './InvoicesListContainer';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  usePagination: () => ({}),
}));
jest.mock('./InvoicesList', () => jest.fn().mockReturnValue('InvoicesList'));
jest.mock('./hooks', () => ({
  ...jest.requireActual('./hooks'),
  useInvoices: jest.fn().mockReturnValue({}),
}));

const defaultProps = {
  mutator: {
    invoicesListOrganizations: {
      GET: jest.fn().mockReturnValue(Promise.resolve([])),
    },
  },
  location,
};
const renderInvoicesListContainer = (props = defaultProps) => render(
  <InvoicesListContainer {...props} />,
);

describe('InvoicesListContainer', () => {
  beforeEach(() => {
    useInvoices.mockClear();
    defaultProps.mutator.invoicesListOrganizations.GET.mockClear();
  });

  it('should display InvoicesList', () => {
    renderInvoicesListContainer();

    expect(screen.getByText('InvoicesList')).toBeDefined();
  });

  it('should pass useInvoices result to InvoiceList', () => {
    const records = [invoice];

    InvoicesList.mockClear();
    useInvoices.mockReturnValue({ invoices: records });
    renderInvoicesListContainer();

    expect(InvoicesList.mock.calls[0][0].invoices).toBe(records);
  });

  it('should load invoice vendors', async () => {
    renderInvoicesListContainer();

    await act(() => useInvoices.mock.calls[0][0].fetchVendors([invoice]));

    expect(defaultProps.mutator.invoicesListOrganizations.GET).toHaveBeenCalledWith({
      params: {
        limit: 1000,
        query: `id==${invoice.vendorId}`,
      },
    });
  });
});
