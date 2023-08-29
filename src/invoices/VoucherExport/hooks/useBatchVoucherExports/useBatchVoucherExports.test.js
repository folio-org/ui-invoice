import { QueryClient, QueryClientProvider } from 'react-query';

import { renderHook, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { useBatchVoucherExports } from './useBatchVoucherExports';

const queryClient = new QueryClient();
// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const batchVoucherExports = [{ id: 'exportId' }];

describe('useBatchVoucherExports', () => {
  it('should fetch batch voucher exports for corresponding batch group', async () => {
    useOkapiKy.mockClear().mockReturnValue({
      get: () => ({
        json: jest.fn(() => Promise.resolve({
          batchVoucherExports,
          totalRecords: batchVoucherExports.length,
        })),
      }),
    });

    const { result } = renderHook(() => useBatchVoucherExports('batchGroupId'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.totalRecords).toEqual(batchVoucherExports.length);
  });
});
