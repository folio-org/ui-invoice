import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { renderHook } from '@testing-library/react-hooks';

import '@folio/stripes-acq-components/test/jest/__mock__';
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
    const { result, waitFor } = renderHook(() => useInvoiceOrders({ poNumbers: ['poNumber'] }), { wrapper });

    await waitFor(() => {
      return !result.current.isLoading;
    });

    expect(result.current.orders).toEqual(resultData);
  });
});
