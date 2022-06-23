import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { renderHook } from '@testing-library/react-hooks';

import { useOkapiKy } from '@folio/stripes/core';

import { useOrderLines } from './useOrderLines';

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useOrderLines', () => {
  it('should return order lines', async () => {
    useOkapiKy.mockClear().mockReturnValue({
      get: () => ({
        json: () => Promise.resolve({ orderLines: [{ id: 'orderLineId' }] }),
      }),
    });

    const { result, waitFor } = renderHook(() => useOrderLines(['orderId']), { wrapper });

    await waitFor(() => {
      return !result.current.isLoading;
    });

    expect(result.current.orderLines.length).toBe(1);
  });
});
