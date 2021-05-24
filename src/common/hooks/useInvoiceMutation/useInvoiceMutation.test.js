import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { renderHook } from '@testing-library/react-hooks';

import { useOkapiKy } from '@folio/stripes/core';

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
    const postMock = jest.fn();

    useOkapiKy.mockClear().mockReturnValue({
      post: postMock,
    });

    const { result } = renderHook(
      () => useInvoiceMutation(),
      { wrapper },
    );

    await result.current.mutateInvoice({
      status: 'Open',
    });

    expect(postMock).toHaveBeenCalled();
  });

  it('should make put request when id is provided', async () => {
    const putMock = jest.fn();

    useOkapiKy.mockClear().mockReturnValue({
      put: putMock,
    });

    const { result } = renderHook(
      () => useInvoiceMutation(),
      { wrapper },
    );

    await result.current.mutateInvoice({
      id: 1,
      status: 'Paid',
    });

    expect(putMock).toHaveBeenCalled();
  });
});
