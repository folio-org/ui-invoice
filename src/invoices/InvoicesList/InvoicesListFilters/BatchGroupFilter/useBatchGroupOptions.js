import { useQuery } from 'react-query';

import { useOkapiKy, useNamespace } from '@folio/stripes/core';
import { LIMIT_MAX } from '@folio/stripes-acq-components';

import { BATCH_GROUPS_API } from '../../../../common/constants';

export const useBatchGroupOptions = () => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'batch-group-options' });

  const searchParams = {
    limit: LIMIT_MAX,
    query: 'cql.allRecords=1 sortby name',
  };

  const { isLoading, data = {} } = useQuery(
    [namespace],
    () => ky.get(BATCH_GROUPS_API, { searchParams }).json(),
  );

  const batchGroupOptions = data.batchGroups?.map(({ id, name }) => ({
    label: name,
    value: id,
  })) ?? [];

  return ({
    isLoading,
    batchGroupOptions,
  });
};
