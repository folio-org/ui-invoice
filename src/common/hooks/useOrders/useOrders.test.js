import { QueryClient, QueryClientProvider } from 'react-query';

import { renderHook, waitFor } from '@folio/jest-config-stripes/testing-library/react';
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

    const { result } = renderHook(() => useOrders(['orderId']), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.orders.length).toBe(1);
  });
});
