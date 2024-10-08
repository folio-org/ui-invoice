import { QueryClient, QueryClientProvider } from 'react-query';

import { renderHook } from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { useInvoiceLineMutation } from './useInvoiceLineMutation';

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useInvoiceLineMutation', () => {
  const kyMock = jest.fn();

  beforeEach(() => {
    kyMock.mockClear();
    useOkapiKy.mockClear().mockReturnValue(kyMock);
  });

  it('should make post request when id is not provided', async () => {
    const { result } = renderHook(
      () => useInvoiceLineMutation(),
      { wrapper },
    );

    await result.current.mutateInvoiceLine({
      status: 'Open',
    });

    expect(kyMock.mock.calls[0][1].method).toBe('post');
  });

  it('should make put request when id is provided', async () => {
    const { result } = renderHook(
      () => useInvoiceLineMutation(),
      { wrapper },
    );

    await result.current.mutateInvoiceLine({
      data: {
        id: 1,
        status: 'Paid',
      },
    });

    expect(kyMock.mock.calls[0][1].method).toBe('put');
  });

  it('should make delete request when method was specified', async () => {
    const { result } = renderHook(
      () => useInvoiceLineMutation(),
      { wrapper },
    );

    await result.current.mutateInvoiceLine({
      data: {
        id: 1,
        status: 'Paid',
      },
      options: {
        method: 'delete',
      },
    });

    expect(kyMock.mock.calls[0][1].method).toBe('delete');
  });

  describe('createInvoiceLines', () => {
    const invoiceLines = [
      { status: 'Open', invoiceId: 1 },
      { status: 'Open', invoiceId: 2 },
    ];
    const mockKy = {
      post: jest.fn().mockReturnValue({
        json: () => Promise.resolve({}),
      }),
    };

    beforeEach(() => {
      useOkapiKy.mockClear().mockReturnValue(mockKy);
    });

    it('should make post requests for each invoice line', async () => {
      const { result } = renderHook(
        () => useInvoiceLineMutation(),
        { wrapper },
      );

      await result.current.createInvoiceLines({ invoiceLines });

      expect(mockKy.post).toHaveBeenCalled();
      expect(mockKy.post).toHaveBeenCalledTimes(2);
    });
  });
});
