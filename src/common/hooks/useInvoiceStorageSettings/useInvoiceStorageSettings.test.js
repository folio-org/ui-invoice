import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';
import { LIMIT_MAX } from '@folio/stripes-acq-components';

import { INVOICE_STORAGE_SETTINGS_API } from '../../constants';
import { useInvoiceStorageSettings } from './useInvoiceStorageSettings';

const mockData = {
  settings: [{ id: '1', key: 'foo', value: 'bar' }],
  totalRecords: 1,
};

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useInvoiceStorageSettings', () => {
  const kyGetMock = jest.fn();

  beforeEach(() => {
    kyGetMock.mockReturnValue(({
      json: jest.fn().mockResolvedValue(mockData),
    }));
    useOkapiKy.mockReturnValue({ get: kyGetMock });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return default data when no data is fetched', async () => {
    kyGetMock.mockReturnValue({
      json: jest.fn().mockResolvedValue({}),
    });

    const { result } = renderHook(() => useInvoiceStorageSettings(), { wrapper });

    await waitFor(() => expect(result.current.isFetching).toBeFalsy());

    expect(result.current.settings).toEqual([]);
    expect(result.current.totalRecords).toBeUndefined();
  });

  it('should return settings and totalRecords from API', async () => {
    const { result } = renderHook(() => useInvoiceStorageSettings(), { wrapper });

    await waitFor(() => expect(result.current.isFetching).toBeFalsy());

    expect(result.current.settings).toEqual(mockData.settings);
    expect(result.current.totalRecords).toBe(1);
  });

  it('should build correct searchParams when key is provided', async () => {
    const { result } = renderHook(() => useInvoiceStorageSettings({ key: 'test-key' }), { wrapper });

    await waitFor(() => expect(result.current.isFetching).toBeFalsy());

    expect(kyGetMock).toHaveBeenCalledWith(
      INVOICE_STORAGE_SETTINGS_API,
      {
        searchParams: {
          limit: LIMIT_MAX,
          query: 'key=="test-key" sortBy value/sort.ascending',
        },
        signal: expect.any(AbortSignal),
      },
    );
  });

  it('should pass queryOptions to useQuery', async () => {
    const queryOptions = { enabled: false };
    const { result } = renderHook(() => useInvoiceStorageSettings({ key: 'test', ...queryOptions }), { wrapper });

    await waitFor(() => expect(result.current.isFetching).toBeFalsy());

    expect(kyGetMock).not.toHaveBeenCalled();
  });
});
