import { useQuery } from 'react-query';

import {
  useOkapiKy,
  useNamespace,
} from '@folio/stripes/core';
import {
  batchRequest,
  ORDERS_API,
} from '@folio/stripes-acq-components';

const DEFAULT_VALUE = [];

export const useOrdersByPoNumbers = (poNumbers = DEFAULT_VALUE, options = {}) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'orders-by-poNumbers' });

  const searchParams = {
    limit: '1000',
    query: `poNumber==(${poNumbers.join(' or ')})`,
  };

  const { isLoading, data: orders = DEFAULT_VALUE } = useQuery(
    [namespace, poNumbers],
    () => batchRequest(
      ({ signal }) => ky
        .get(ORDERS_API, { searchParams, signal })
        .json()
        .then(({ purchaseOrders }) => purchaseOrders)
        .catch(() => DEFAULT_VALUE),
      poNumbers,
    ),
    {
      enabled: Boolean(poNumbers.length),
      ...options,
    },
  );

  return ({
    isLoading,
    orders,
  });
};
