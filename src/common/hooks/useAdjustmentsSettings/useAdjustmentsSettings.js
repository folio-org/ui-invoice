import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';
import {
  CQLBuilder,
  LIMIT_MAX,
} from '@folio/stripes-acq-components';

import { ADJUSTMENTS_PRESETS_API } from '../../constants';

const DEFAULT_DATA = [];

export const useAdjustmentsSettings = (options = {}) => {
  const {
    enabled = true,
    tenantId,
    ...queryOptions
  } = options;

  const ky = useOkapiKy({ tenant: tenantId });
  const [namespace] = useNamespace({ key: 'invoice-storage-settings' });

  const cql = new CQLBuilder();
  const searchParams = {
    limit: LIMIT_MAX,
    query: (
      cql.allRecords()
        .sortBy('metadata.createdDate')
        .build()
    ),
  };

  const { data, ...rest } = useQuery({
    queryKey: [namespace, tenantId],
    queryFn: ({ signal }) => ky.get(ADJUSTMENTS_PRESETS_API, { searchParams, signal }).json(),
    enabled,
    ...queryOptions,
  });

  return ({
    adjustmentPresets: data?.adjustmentPresets || DEFAULT_DATA,
    totalRecords: data?.totalRecords,
    ...rest,
  });
};
