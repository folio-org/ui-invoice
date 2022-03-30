import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';
import {
  LIMIT_MAX,
} from '@folio/stripes-acq-components';

import {
  BATCH_GROUPS_API,
} from '../../../../common/constants';

export const useBatchGroups = () => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'batch-groups' });

  const searchParams = {
    limit: LIMIT_MAX,
    query: 'cql.allRecords=1 sortby name',
  };

  const queryKey = [namespace];

  const queryFn = () => ky.get(BATCH_GROUPS_API, { searchParams }).json();

  const { data, isFetching, isLoading } = useQuery({
    queryKey,
    queryFn,
  });

  return {
    batchGroups: data?.batchGroups || [],
    totalRecords: data?.totalRecords,
    isFetching,
    isLoading,
  };
};
