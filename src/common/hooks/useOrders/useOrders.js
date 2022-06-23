import { useQuery } from 'react-query';

import {
  useOkapiKy,
  useNamespace,
} from '@folio/stripes/core';

import {
  batchRequest,
  ORDERS_API,
} from '@folio/stripes-acq-components';

export const useOrders = (orderIds, options = {}) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'compositeOrders' });

  const { isLoading, data: orders = [] } = useQuery(
    [namespace, orderIds],
    () => batchRequest(
      ({ params: searchParams }) => ky
        .get(ORDERS_API, { searchParams })
        .json()
        .then(({ purchaseOrders }) => purchaseOrders)
        .catch(() => []),
      orderIds,
    ),
    { enabled: Boolean(orderIds?.length), ...options },
  );

  return ({
    isLoading,
    orders,
  });
};
