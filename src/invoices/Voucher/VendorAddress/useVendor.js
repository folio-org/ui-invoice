import { useQuery } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';
import { VENDORS_API } from '@folio/stripes-acq-components';

export const useVendor = (vendorId) => {
  const ky = useOkapiKy();

  const { isLoading, data: vendor = {} } = useQuery(
    [VENDORS_API, vendorId],
    () => ky.get(`${VENDORS_API}/${vendorId}`).json(),
  );

  return ({
    isLoading,
    vendor,
  });
};
