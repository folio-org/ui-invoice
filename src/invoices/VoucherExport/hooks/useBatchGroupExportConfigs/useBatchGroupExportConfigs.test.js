import { QueryClient, QueryClientProvider } from 'react-query';

import { renderHook, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { useBatchGroupExportConfigs } from './useBatchGroupExportConfigs';

const queryClient = new QueryClient();
// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const exportConfigs = { id: 'configIg' };

describe('useBatchGroupExportConfigs', () => {
  it('should return export configs for required batch group', async () => {
    useOkapiKy.mockClear().mockReturnValue({
      get: () => ({
        json: jest.fn(() => Promise.resolve({
          exportConfigs: [exportConfigs],
        })),
      }),
    });

    const { result } = renderHook(() => useBatchGroupExportConfigs('batchGroupId'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.exportConfigs.id).toEqual(exportConfigs.id);
  });
});
