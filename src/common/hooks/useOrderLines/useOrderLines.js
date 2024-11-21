import { useQuery } from 'react-query';

import {
  useOkapiKy,
  useNamespace,
} from '@folio/stripes/core';

import {
  batchRequest,
  LINES_API,
} from '@folio/stripes-acq-components';

const buildQueryByOrderId = (itemsChunk) => {
  const query = itemsChunk
    .map(id => `purchaseOrderId=${id}`)
    .join(' or ');

  return query || '';
};

export const useOrderLines = (orderIds, options = {}) => {
  const { enabled = true, buildQuery = buildQueryByOrderId, ...otherOptions } = options;
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'order-lines' });

  const { isLoading, data: orderLines = [] } = useQuery(
    [namespace, orderIds],
    () => batchRequest(
      ({ params: searchParams }) => ky
        .get(LINES_API, { searchParams })
        .json()
        .then(({ poLines }) => poLines)
        .catch(() => []),
      orderIds,
      buildQuery,
    ),
    {
      enabled: enabled && Boolean(orderIds?.length),
      ...otherOptions,
    },
  );

  return ({
    isLoading,
    orderLines,
  });
};
