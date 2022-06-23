import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { renderHook } from '@testing-library/react-hooks';

import { useOkapiKy } from '@folio/stripes/core';

import { useOrders } from './useOrders';

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useOrders', () => {
  it('should return orders', async () => {
    useOkapiKy.mockClear().mockReturnValue({
      get: () => ({
        json: () => Promise.resolve({ purchaseOrders: [{ id: 'orderId' }] }),
      }),
    });

    const { result, waitFor } = renderHook(() => useOrders(['orderId']), { wrapper });

    await waitFor(() => {
      return !result.current.isLoading;
    });

    expect(result.current.orders.length).toBe(1);
  });
});
