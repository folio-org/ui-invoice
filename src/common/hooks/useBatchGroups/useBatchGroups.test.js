import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { useBatchGroups } from './useBatchGroups';

const queryClient = new QueryClient();
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
    const { result } = renderHook(() => useBatchGroups(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.totalRecords).toEqual(batchGroups.length);
  });
});
