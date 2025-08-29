import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';
import { LIMIT_MAX } from '@folio/stripes-acq-components';

import {
  CONFIG_NAME_ADJUSTMENTS,
  INVOICE_STORAGE_SETTINGS_API,
} from '../../constants';

const DEFAULT_DATA = [];

export const useConfigsAdjustments = (options = {}) => {
  const { tenantId, ...queryOptions } = options;

  const ky = useOkapiKy({ tenant: tenantId });
  const [namespace] = useNamespace({ key: 'configurations-invoice-adjustments' });

  const searchParams = {
    limit: LIMIT_MAX,
    query: `(key=${CONFIG_NAME_ADJUSTMENTS}) sortby metadata.createdDate`,
  };

  const { isLoading, data } = useQuery({
    queryKey: [namespace],
    queryFn: ({ signal }) => ky.get(INVOICE_STORAGE_SETTINGS_API, { searchParams, signal }).json(),
    ...queryOptions,
  });

  return ({
    isLoading,
    adjustments: data?.settings || DEFAULT_DATA,
  });
};
