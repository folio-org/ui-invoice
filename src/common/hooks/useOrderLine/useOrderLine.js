import { useQuery } from 'react-query';

import {
  useOkapiKy,
  useNamespace,
} from '@folio/stripes/core';

import { LINES_API } from '@folio/stripes-acq-components';

const DEFAULT_VALUE = {};

export const useOrderLine = (orderLineId) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'order-line' });

  const { isLoading, data } = useQuery(
    [namespace, orderLineId],
    () => ky.get(`${LINES_API}/${orderLineId}`).json(),
    { enabled: Boolean(orderLineId) },
  );

  return ({
    isLoading,
    orderLine: data || DEFAULT_VALUE,
  });
};
