import { QueryClient, QueryClientProvider } from 'react-query';

import { renderHook, waitFor } from '@folio/jest-config-stripes/testing-library/react';
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

    const { result } = renderHook(() => useInvoiceLine(invoiceLineId), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.invoiceLine.id).toBe(invoiceLineId);
  });
});
