import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { INVOICE_STORAGE_SETTINGS_API } from '../../constants';
import { useInvoiceStorageSettingById } from './useInvoiceStorageSettingById';

const mockData = { id: '1', key: 'foo', value: 'bar' };

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

  it('should return settings and totalRecords from API', async () => {
    const { result } = renderHook(() => useInvoiceStorageSettingById('test'), { wrapper });

    await waitFor(() => expect(result.current.isFetching).toBeFalsy());

    expect(result.current.setting).toEqual(mockData);
    expect(kyGetMock).toHaveBeenCalledWith(
      `${INVOICE_STORAGE_SETTINGS_API}/test`,
      {
        signal: expect.any(AbortSignal),
      },
    );
  });
});
