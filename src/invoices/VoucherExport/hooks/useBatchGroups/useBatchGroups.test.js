import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { renderHook } from '@testing-library/react-hooks';

import { useOkapiKy } from '@folio/stripes/core';

import { useBatchGroups } from './useBatchGroups';

const queryClient = new QueryClient();
// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const batchGroups = [{ id: 'batchGroupId' }];

describe('useBatchGroups', () => {
  beforeEach(() => {
    useOkapiKy.mockClear().mockReturnValue({
      get: () => ({
        json: jest.fn(() => Promise.resolve({
          batchGroups,
          totalRecords: batchGroups.length,
        })),
      }),
    });
  });

  it('should fetch batch groups', async () => {
    const { result, waitFor } = renderHook(() => useBatchGroups(), { wrapper });

    await waitFor(() => !result.current.isLoading);

    expect(result.current.totalRecords).toEqual(batchGroups.length);
  });
});
