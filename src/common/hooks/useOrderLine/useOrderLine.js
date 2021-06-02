import { useQuery } from 'react-query';

import {
  useOkapiKy,
  useNamespace,
} from '@folio/stripes/core';

import { PO_LINES_API } from '../../constants';

export const useOrderLine = (orderLineId) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'order-line' });

  const { isLoading, data: orderLine } = useQuery(
    [namespace, orderLineId],
    () => ky.get(`${PO_LINES_API}/${orderLineId}`).json(),
    { enabled: Boolean(orderLineId) },
  );

  return ({
    isLoading,
    orderLine,
  });
};
