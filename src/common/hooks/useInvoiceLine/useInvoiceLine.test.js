import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { renderHook } from '@testing-library/react-hooks';

import { useOkapiKy } from '@folio/stripes/core';

import { useInvoiceLine } from './useInvoiceLine';

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const invoiceLineId = 'invoiceLineId';

describe('useInvoiceLine', () => {
  it('should return invoice line', async () => {
    useOkapiKy.mockClear().mockReturnValue({
      get: () => ({
        json: () => ({
          id: invoiceLineId,
        }),
      }),
    });

    const { result, waitFor } = renderHook(() => useInvoiceLine(invoiceLineId), { wrapper });

    await waitFor(() => {
      return !result.current.isLoading;
    });

    expect(result.current.invoiceLine.id).toBe(invoiceLineId);
  });
});
