import { QueryClient, QueryClientProvider } from 'react-query';

import { renderHook, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { batchGroup } from '../../../../../test/jest/fixtures';
import { useBatchGroupOptions } from './useBatchGroupOptions';

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const batchGroups = [batchGroup];

describe('useBatchGroupOptions', () => {
  it('should return batch group options', async () => {
    useOkapiKy.mockClear().mockReturnValue({
      get: () => ({
        json: () => ({
          batchGroups,
        }),
      }),
    });

    const { result } = renderHook(() => useBatchGroupOptions(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.batchGroupOptions[0]).toStrictEqual({ label: batchGroup.name, value: batchGroup.id });
  });
});
