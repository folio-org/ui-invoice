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

export const useReceivingHistory = (poLineId) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'invoice-line-receiving-history' });

  const { isLoading, data = {} } = useQuery(
    [namespace, poLineId],
    () => ky.get(ORDER_PIECES_API, {
      searchParams: {
        query: `poLineId==${poLineId} and receivingStatus==${PIECE_STATUS.received} sortby receivedDate/sort.descending`,
        limit: LIMIT_MAX,
      },
    }).json(),
    { enabled: Boolean(poLineId) },
  );

  return {
    pieces: data.pieces || [],
    isLoading,
  };
};
