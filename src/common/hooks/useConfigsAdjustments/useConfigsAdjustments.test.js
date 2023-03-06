import { QueryClient, QueryClientProvider } from 'react-query';
import { renderHook } from '@testing-library/react-hooks';

import { useOkapiKy } from '@folio/stripes/core';

import { useConfigsAdjustments } from './useConfigsAdjustments';

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const configValue = '{"alwaysShow":true,"exportToAccounting":true,"prorate":"Not prorated","relationToTotal":"In addition to","type":"Amount","description":"Test","defaultAmount":"100"}';

describe('useConfigsAdjustments', () => {
  it('should return invoice adjustments configurations', async () => {
    useOkapiKy.mockClear().mockReturnValue({
      get: () => ({
        json: async () => ({
          configs: [{ value: configValue }],
        }),
      }),
    });

    const { result, waitFor } = renderHook(() => useConfigsAdjustments(), { wrapper });

    await waitFor(() => {
      return !result.current.isLoading;
    });

    expect(result.current.adjustments[0].value).toEqual(configValue);
  });
});
