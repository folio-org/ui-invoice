import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';
import {
  LIMIT_MAX,
  ORDER_PIECES_API,
  PIECE_STATUS,
} from '@folio/stripes-acq-components';

export const useReceivingHistory = (poLineId, { pagination } = {}) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'invoice-line-receiving-history' });

  const { isLoading, isFetching, data = {} } = useQuery(
    [namespace, poLineId, pagination?.limit, pagination?.offset],
    () => ky.get(ORDER_PIECES_API, {
      searchParams: {
        query: `poLineId==${poLineId} and receivingStatus==${PIECE_STATUS.received} sortby receivedDate/sort.descending`,
        limit: pagination?.limit ?? LIMIT_MAX,
        offset: pagination?.offset ?? 0,
      },
    }).json(),
    {
      enabled: Boolean(poLineId),
      keepPreviousData: true,
    },
  );

  return {
    pieces: data.pieces || [],
    piecesCount: data.totalRecords,
    isLoading,
    isFetching,
  };
};
