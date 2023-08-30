import { QueryClient, QueryClientProvider } from 'react-query';

import { renderHook, waitFor } from '@folio/jest-config-stripes/testing-library/react';
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

    const { result } = renderHook(() => useBatchGroup(batchGroupId), { wrapper });

    await waitFor(() => expect(result.current.isBatchGroupLoading).toBeFalsy());

    expect(result.current.batchGroup.id).toBe(batchGroupId);
  });
});
