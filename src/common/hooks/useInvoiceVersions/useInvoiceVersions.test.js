import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { useInvoiceVersions } from './useInvoiceVersions';

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const invoiceId = 'invoiceId';
const invoiceAuditEvents = [
  {
    id: '1',
    invoiceId: 'invoiceId',
    total: 100,
  },
  {
    id: '2',
    invoiceId: 'invoiceId',
    total: 200,
  },
];

describe('useInvoiceVersions', () => {
  it('should return invoice versions', async () => {
    useOkapiKy.mockClear().mockReturnValue({
      get: () => ({
        json: () => ({ invoiceAuditEvents }),
      }),
    });

    const { result } = renderHook(() => useInvoiceVersions(invoiceId), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.versions).toHaveLength(invoiceAuditEvents.length);
  });
});
