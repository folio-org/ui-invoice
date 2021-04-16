import { useQuery } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { BATCH_GROUPS_API } from '../../constants';

export const useBatchGroup = (batchGroupId) => {
  const ky = useOkapiKy();

  const { isLoading: isBatchGroupLoading, data: batchGroup = {} } = useQuery(
    [BATCH_GROUPS_API, batchGroupId],
    () => ky.get(`${BATCH_GROUPS_API}/${batchGroupId}`).json(),
    { enabled: Boolean(batchGroupId) },
  );

  return ({
    isBatchGroupLoading,
    batchGroup,
  });
};
