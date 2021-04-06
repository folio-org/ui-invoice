import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { renderHook } from '@testing-library/react-hooks';

import { useOkapiKy } from '@folio/stripes/core';

import { useVendor } from './useVendor';

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const vendorId = 'vendorId';

describe('useVendor', () => {
  it('should return vendor', async () => {
    useOkapiKy.mockClear().mockReturnValue({
      get: () => ({
        json: () => ({
          isLoading: false,
          vendor: { id: vendorId },
        }),
      }),
    });

    const { result, waitFor } = renderHook(() => useVendor(vendorId), { wrapper });

    await waitFor(() => {
      return !result.current.isLoading;
    });

    expect(result.current.vendor.vendor.id).toBe(vendorId);
  });
});
