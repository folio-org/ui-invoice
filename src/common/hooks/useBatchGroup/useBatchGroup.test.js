import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { renderHook } from '@testing-library/react-hooks';

import { useOkapiKy } from '@folio/stripes/core';

import { useBatchGroup } from './useBatchGroup';

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const batchGroupId = 'batchGroupId';

describe('useBatchGroup', () => {
  it('should return batch group', async () => {
    useOkapiKy.mockClear().mockReturnValue({
      get: () => ({
        json: () => ({
          id: batchGroupId,
        }),
      }),
    });

    const { result, waitFor } = renderHook(() => useBatchGroup(batchGroupId), { wrapper });

    await waitFor(() => {
      return !result.current.isBatchGroupLoading;
    });

    expect(result.current.batchGroup.id).toBe(batchGroupId);
  });
});
