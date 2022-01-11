import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { renderHook } from '@testing-library/react-hooks';

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

    const { result, waitFor } = renderHook(() => useBatchGroupOptions(), { wrapper });

    await waitFor(() => {
      return !result.current.isLoading;
    });

    expect(result.current.batchGroupOptions[0]).toStrictEqual({ label: batchGroup.name, value: batchGroup.id });
  });
});
