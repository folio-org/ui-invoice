import { useQuery } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { PO_LINES_API } from '../../constants';

export const useOrderLine = (orderLineId) => {
  const ky = useOkapiKy();

  const { isLoading, data: orderLine } = useQuery(
    ['ui-invoice', 'order-line', orderLineId],
    () => ky.get(`${PO_LINES_API}/${orderLineId}`).json(),
    { enabled: Boolean(orderLineId) },
  );

  return ({
    isLoading,
    orderLine,
  });
};
