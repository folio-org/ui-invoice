import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { renderHook } from '@testing-library/react-hooks';

import { useOkapiKy } from '@folio/stripes/core';

import { useOrderLine } from './useOrderLine';

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const orderLineId = 'orderLineId';

describe('useOrderLine', () => {
  it('should return order line', async () => {
    useOkapiKy.mockClear().mockReturnValue({
      get: () => ({
        json: () => ({
          id: orderLineId,
        }),
      }),
    });

    const { result, waitFor } = renderHook(() => useOrderLine(orderLineId), { wrapper });

    await waitFor(() => {
      return !result.current.isLoading;
    });

    expect(result.current.orderLine.id).toBe(orderLineId);
  });
});
