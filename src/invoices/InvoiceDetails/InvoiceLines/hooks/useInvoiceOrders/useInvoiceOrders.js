import { useQuery } from 'react-query';

import {
  useOkapiKy,
  useNamespace,
} from '@folio/stripes/core';

import {
  ORDERS_API,
  VENDORS_API,

  batchRequest,
} from '@folio/stripes-acq-components';

const buildQueryByOrderNumbers = (itemsChunk) => {
  const query = itemsChunk
    .map(poNumber => `poNumber=${poNumber}`)
    .join(' or ');

  return query || '';
};

export const useInvoiceOrders = (invoice) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'invoice-orders' });

  const { isLoading, data = [] } = useQuery(
    [namespace, invoice.id],
    async () => {
      const orders = await batchRequest(
        ({ params: searchParams }) => ky
          .get(ORDERS_API, { searchParams })
          .json()
          .then(({ purchaseOrders }) => purchaseOrders),
        invoice.poNumbers,
        buildQueryByOrderNumbers,
      );

      const vendors = await batchRequest(
        ({ params: searchParams }) => ky
          .get(VENDORS_API, { searchParams })
          .json()
          .then(({ organizations }) => organizations),
        orders.map(({ vendor }) => vendor),
      );
      const vendordsMap = vendors.reduce((acc, vendor) => {
        acc[vendor.id] = vendor;

        return acc;
      }, {});

      return orders.map(order => ({
        ...order,
        vendor: vendordsMap[order.vendor],
      }));
    },
  );

  return {
    isLoading,
    orders: data,
  };
};
