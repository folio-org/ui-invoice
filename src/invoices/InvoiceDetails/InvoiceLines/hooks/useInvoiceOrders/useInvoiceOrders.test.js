import { QueryClient, QueryClientProvider } from 'react-query';

import { renderHook, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import {
  ORDERS_API,
  VENDORS_API,
} from '@folio/stripes-acq-components';

import { useInvoiceOrders } from './useInvoiceOrders';

const vendor = {
  id: 'vendorId',
};
const order = {
  id: 'orderId',
  vendor: vendor.id,
};

const resultData = [{
  ...order,
  vendor,
}];

const queryClient = new QueryClient();

const kyResponseMap = {
  [ORDERS_API]: { purchaseOrders: [order] },
  [VENDORS_API]: { organizations: [vendor] },
};

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useInvoiceOrders', () => {
  beforeEach(() => {
    useOkapiKy
      .mockClear()
      .mockReturnValue({
        get: (path) => ({
          json: () => Promise.resolve(kyResponseMap[path]),
        }),
      });
  });

  it('should fetch connected to invoice orders with full vendors', async () => {
    const { result } = renderHook(() => useInvoiceOrders({ poNumbers: ['poNumber'] }), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.orders).toEqual(resultData);
  });
});
