import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { renderHook } from '@testing-library/react-hooks';

import { useOkapiKy } from '@folio/stripes/core';

import { useVendors } from './useVendors';

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useVendors', () => {
  it('should return vendors fetched by id', async () => {
    useOkapiKy.mockClear().mockReturnValue({
      get: () => ({
        json: () => Promise.resolve({ vendors: [{ id: 'vendorId' }] }),
      }),
    });

    const { result, waitFor } = renderHook(() => useVendors(['vendorId']), { wrapper });

    await waitFor(() => {
      return !result.current.isLoading;
    });

    expect(result.current.vendors.length).toBe(1);
  });
});
