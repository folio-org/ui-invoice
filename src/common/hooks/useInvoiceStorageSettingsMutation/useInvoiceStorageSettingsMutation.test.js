import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  act,
  renderHook,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { useInvoiceStorageSettingsMutation } from './useInvoiceStorageSettingsMutation';
import { INVOICE_STORAGE_SETTINGS_API } from '../../constants';

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useInvoiceStorageSettingsMutation', () => {
  const putMock = jest.fn();
  const postMock = jest.fn();
  const deleteMock = jest.fn();

  beforeEach(() => {
    useOkapiKy.mockReturnValue({
      put: putMock,
      post: postMock,
      delete: deleteMock,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call PUT when data has an id', async () => {
    const data = { id: '123', key: 'foo', value: 'bar' };

    putMock.mockResolvedValue({ ok: true });

    const { result } = renderHook(() => useInvoiceStorageSettingsMutation(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync({ data });
    });

    expect(putMock).toHaveBeenCalledWith(
      `${INVOICE_STORAGE_SETTINGS_API}/${data.id}`,
      { json: data },
    );
    expect(postMock).not.toHaveBeenCalled();
  });

  it('should call POST when data does not have an id', async () => {
    const data = { key: 'foo', value: 'bar' };

    postMock.mockResolvedValue({ ok: true });

    const { result } = renderHook(() => useInvoiceStorageSettingsMutation(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync({ data });
    });

    expect(postMock).toHaveBeenCalledWith(
      INVOICE_STORAGE_SETTINGS_API,
      { json: data },
    );
    expect(putMock).not.toHaveBeenCalled();
  });

  it('should call DELETE when data has an id', async () => {
    const data = { id: '123', key: 'foo', value: 'bar' };

    deleteMock.mockResolvedValue({ ok: true });

    const { result } = renderHook(() => useInvoiceStorageSettingsMutation(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync({ data });
    });

    expect(deleteMock).toHaveBeenCalledWith(
      `${INVOICE_STORAGE_SETTINGS_API}/${data.id}`,
    );
  });
});
