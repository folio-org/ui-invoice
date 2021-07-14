import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { renderHook } from '@testing-library/react-hooks';

import { useOkapiKy } from '@folio/stripes/core';

import { useVoucherByInvoiceId } from './useVoucherByInvoiceId';

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const invoiceId = 'invoiceId';
const voucherId = 'voucherId';

describe('useVoucherByInvoiceId', () => {
  it('should return voucher by invoice id', async () => {
    useOkapiKy.mockClear().mockReturnValue({
      get: () => ({
        json: () => ({
          vouchers: [{ id: voucherId }],
        }),
      }),
    });

    const { result, waitFor } = renderHook(() => useVoucherByInvoiceId(invoiceId), { wrapper });

    await waitFor(() => {
      return !result.current.isVoucherLoading;
    });

    expect(result.current.voucher.id).toBe(voucherId);
  });
});
