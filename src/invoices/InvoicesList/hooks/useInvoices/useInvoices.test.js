import { renderHook } from '@testing-library/react-hooks';
import { useLocation } from 'react-router';
import { QueryClient, QueryClientProvider } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { invoice } from '../../../../../test/jest/fixtures';
import { useBuildQuery } from '../useBuildQuery';
import { useInvoices } from './useInvoices';

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useLocation: jest.fn(),
}));
jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useNamespace: () => ['namespace'],
  useOkapiKy: jest.fn(),
}));
jest.mock('../useBuildQuery', () => ({ useBuildQuery: jest.fn() }));

const invoices = [invoice];
const queryMock = '(cql.allRecords=1) sortby invoiceDate/sort.descending';

const queryClient = new QueryClient();
// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useInvoices', () => {
  beforeEach(() => {
    useBuildQuery.mockReturnValue(jest.fn(() => queryMock));

    useOkapiKy
      .mockClear()
      .mockReturnValue({
        get: () => ({
          json: () => ({
            invoices,
            totalRecords: invoices.length,
          }),
        }),
      });
  });

  it('should call fetchVendors to load invoice related vendors', async () => {
    useLocation
      .mockClear()
      .mockReturnValue({ search: 'vendorId=vendorId' });

    const fetchVendors = jest.fn().mockReturnValue(Promise.resolve({}));
    const { result, waitFor } = renderHook(() => useInvoices({
      pagination: { limit: 5, offset: 0, timestamp: 42 },
      fetchVendors,
    }), { wrapper });

    await waitFor(() => !result.current.isLoading);

    expect(fetchVendors).toHaveBeenCalled();
  });

  it('should return fetched hydrated invoice list', async () => {
    useLocation
      .mockClear()
      .mockReturnValue({ search: 'vendorId=vendorId' });

    const fetchVendors = jest.fn().mockReturnValue(Promise.resolve({
      [invoice.vendorId]: { id: invoice.vendorId },
    }));
    const { result, waitFor } = renderHook(() => useInvoices({
      pagination: { limit: 5, offset: 0, timestamp: 42 },
      fetchVendors,
    }), { wrapper });

    await waitFor(() => !result.current.isFetching);

    expect(result.current.invoices[0].vendor.id).toEqual(invoice.vendorId);
  });
});
