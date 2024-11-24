import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { INVOICE_LINE_API } from '@folio/stripes-acq-components';
import { useOkapiKy } from '@folio/stripes/core';

import { useInvoiceLinesByInvoiceId } from './useInvoiceLinesByInvoiceId';

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const invoiceLines = [
  { id: 'POL-1' },
  { id: 'POL-2' },
];

describe('useInvoiceLinesByInvoiceId', () => {
  const kyMock = {
    get: jest.fn((url) => ({
      json: async () => {
        if (url.startsWith(INVOICE_LINE_API)) {
          return { invoiceLines };
        }

        return {};
      },
    })),
  };

  beforeEach(() => {
    useOkapiKy.mockClear().mockReturnValue(kyMock);
  });

  it('should return invoice lines by invoiceId', async () => {
    const invoiceId = 'invoiceId';
    const { result } = renderHook(() => useInvoiceLinesByInvoiceId(invoiceId), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBeFalsy();
      expect(result.current.invoiceLines).toEqual(invoiceLines);
    });
  });

  it('should return empty invoiceLines if invoiceId is not provided', async () => {
    const { result } = renderHook(() => useInvoiceLinesByInvoiceId(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBeFalsy();
      expect(result.current.invoiceLines).toEqual([]);
    });
  });
});
