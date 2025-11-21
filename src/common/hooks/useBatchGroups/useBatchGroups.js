import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';
import { LIMIT_MAX } from '@folio/stripes-acq-components';

import { BATCH_GROUPS_API } from '../../constants';

const DEFAULT_DATA = [];

export const useBatchGroups = (options = {}) => {
  const {
    enabled = true,
    tenantId,
    ...queryOptions
  } = options;

  const ky = useOkapiKy({ tenant: tenantId });
  const [namespace] = useNamespace({ key: 'batch-groups' });

  const searchParams = {
    limit: LIMIT_MAX,
    query: 'cql.allRecords=1 sortby name',
  };

  const queryKey = [namespace];

  const queryFn = ({ signal }) => ky.get(BATCH_GROUPS_API, { searchParams, signal }).json();

  const { data, ...rest } = useQuery({
    queryKey,
    queryFn,
    enabled,
    ...queryOptions,
  });

  return {
    batchGroups: data?.batchGroups || DEFAULT_DATA,
    totalRecords: data?.totalRecords,
    ...rest,
  };
};
