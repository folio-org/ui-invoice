import { QueryClient, QueryClientProvider } from 'react-query';

import { renderHook, act } from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import INVOICE_STATUS from '../../constants';
import {
  useInvoiceMutation,
} from './useInvoiceMutation';

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useInvoiceMutation', () => {
  it('should make post request when id is not provided', async () => {
    const postMock = jest.fn().mockReturnValue({ json: jest.fn() });

    useOkapiKy.mockClear().mockReturnValue({
      post: postMock,
    });

    const { result } = renderHook(
      () => useInvoiceMutation(),
      { wrapper },
    );

    await act(async () => {
      result.current.mutateInvoice(
        {
          invoice: { status: INVOICE_STATUS.open },
        },
      );
    });

    expect(postMock).toHaveBeenCalled();
  });

  it('should make put request when id is provided', async () => {
    const putMock = jest.fn().mockReturnValue({ json: jest.fn() });

    useOkapiKy.mockClear().mockReturnValue({
      put: putMock,
    });

    const { result } = renderHook(
      () => useInvoiceMutation(),
      { wrapper },
    );

    await act(async () => {
      result.current.mutateInvoice(
        {
          invoice: {
            id: 1,
            status: INVOICE_STATUS.paid,
          },
        },
      );
    });

    expect(putMock).toHaveBeenCalled();
  });

  it('should make delete request', async () => {
    const deleteMock = jest.fn();

    useOkapiKy.mockClear().mockReturnValue({
      delete: deleteMock,
    });

    const { result } = renderHook(
      () => useInvoiceMutation(),
      { wrapper },
    );

    await act(async () => {
      result.current.deleteInvoice();
    });

    expect(deleteMock).toHaveBeenCalled();
  });
});
