import { useQuery } from 'react-query';

import {
  useOkapiKy,
  useNamespace,
} from '@folio/stripes/core';

import {
  batchRequest,
  VENDORS_API,
} from '@folio/stripes-acq-components';

export const useVendors = (vendorIds, options = {}) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'vendors' });

  const { isLoading, data: vendors = [] } = useQuery(
    [namespace, vendorIds],
    () => batchRequest(
      ({ params: searchParams }) => ky
        .get(VENDORS_API, { searchParams })
        .json()
        .then(({ organizations }) => organizations)
        .catch(() => []),
      vendorIds,
    ),
    { enabled: Boolean(vendorIds?.length), ...options },
  );

  return ({
    isLoading,
    vendors,
  });
};
