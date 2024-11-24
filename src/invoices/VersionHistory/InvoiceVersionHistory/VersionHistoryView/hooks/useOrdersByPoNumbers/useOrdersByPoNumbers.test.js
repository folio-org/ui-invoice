import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';
import { ORDERS_API } from '@folio/stripes-acq-components';

import { useOrdersByPoNumbers } from './useOrdersByPoNumbers';

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const purchaseOrders = [
  { poNumber: 'PO-1' },
  { poNumber: 'PO-2' },
];

describe('useOrdersByPoNumbers', () => {
  const kyMock = {
    get: jest.fn((url) => ({
      json: async () => {
        if (url.startsWith(ORDERS_API)) {
          return { purchaseOrders };
        }

        return {};
      },
    })),
  };

  beforeEach(() => {
    useOkapiKy.mockClear().mockReturnValue(kyMock);
  });

  it('should return orders by PO numbers', async () => {
    const poNumbers = ['PO-1', 'PO-2'];
    const { result } = renderHook(() => useOrdersByPoNumbers(poNumbers), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBeFalsy();
      expect(result.current.orders).toEqual(purchaseOrders);
    });
  });

  it('should return empty orders if PO numbers are not provided', async () => {
    const { result } = renderHook(() => useOrdersByPoNumbers(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBeFalsy();
      expect(result.current.orders).toEqual([]);
    });
  });
});
