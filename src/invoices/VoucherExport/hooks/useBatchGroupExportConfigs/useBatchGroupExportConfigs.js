import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';
import {
  LIMIT_MAX,
} from '@folio/stripes-acq-components';

import { EXPORT_CONFIGURATIONS_API } from '../../../../common/constants';

export const useBatchGroupExportConfigs = (batchGroupId) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'batch-group-export-configs' });

  const searchParams = {
    limit: LIMIT_MAX,
    query: `batchGroupId==${batchGroupId}`,
  };

  const queryKey = [
    batchGroupId,
    namespace,
  ];

  const queryFn = () => ky.get(EXPORT_CONFIGURATIONS_API, { searchParams }).json();

  const options = {
    enabled: Boolean(batchGroupId),
  };

  const { data, isLoading } = useQuery({
    queryKey,
    queryFn,
    ...options,
  });

  return {
    exportConfigs: data?.exportConfigs?.[0],
    isLoading,
  };
};
