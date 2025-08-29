import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';
import {
  CQLBuilder,
  LIMIT_MAX,
} from '@folio/stripes-acq-components';
import { INVOICE_STORAGE_SETTINGS_API } from '../../constants';

const DEFAULT_DATA = [];

export const useInvoiceStorageSettings = (options = {}) => {
  const {
    key,
    tenantId,
    ...queryOptions
  } = options;

  const ky = useOkapiKy({ tenant: tenantId });
  const [namespace] = useNamespace({ key: `invoice-storage-settings${key || ''}` });

  const cql = new CQLBuilder();
  const searchParams = {
    limit: LIMIT_MAX,
    query: (
      (key ? cql.equal('key', key) : cql.allRecords())
        .sortBy('value')
        .build()
    ),
  };

  const {
    data,
    isFetching,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [namespace, key, tenantId],
    queryFn: ({ signal }) => ky.get(INVOICE_STORAGE_SETTINGS_API, { searchParams, signal }).json(),
    ...queryOptions,
  });

  return ({
    isFetching,
    isLoading,
    refetch,
    settings: data?.settings || DEFAULT_DATA,
    totalRecords: data?.totalRecords,
  });
};
