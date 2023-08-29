import { QueryClient, QueryClientProvider } from 'react-query';

import { renderHook, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { useVoucher } from './useVoucher';

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const voucherId = 'voucherId';
const invoiceId = 'invoiceId';

describe('useVoucher', () => {
  it('should return voucher, voucher lines, invoice', async () => {
    useOkapiKy.mockClear().mockReturnValue({
      get: () => ({
        json: () => ({
          isLoading: false,
          voucher: { id: voucherId },
          voucherLines: [],
          invoice: { id: invoiceId },
        }),
      }),
    });

    const { result } = renderHook(() => useVoucher(voucherId, invoiceId), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.voucher.voucher.id).toBe(voucherId);
    expect(result.current.voucherLines.length).toBe(0);
    expect(result.current.invoice.invoice.id).toBe(invoiceId);
  });
});
