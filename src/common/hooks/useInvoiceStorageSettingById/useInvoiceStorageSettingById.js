import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

import { INVOICE_STORAGE_SETTINGS_API } from '../../constants';

export const useInvoiceStorageSettingById = (id, options = {}) => {
  const {
    enabled = true,
    tenantId,
    ...queryOptions
  } = options;

  const ky = useOkapiKy({ tenant: tenantId });
  const [namespace] = useNamespace({ key: 'invoice-storage-setting-by-id' });

  const {
    data,
    isFetching,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [namespace, id, tenantId],
    queryFn: ({ signal }) => ky.get(`${INVOICE_STORAGE_SETTINGS_API}/${id}`, { signal }).json(),
    enabled: !!id && enabled,
    ...queryOptions,
  });

  return ({
    isFetching,
    isLoading,
    refetch,
    setting: data,
  });
};
