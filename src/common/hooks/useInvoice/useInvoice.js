import { useQuery } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';
import { INVOICES_API } from '@folio/stripes-acq-components';

const DEFAULT_VALUE = {};

export const useInvoice = (invoiceId, options = {}) => {
  const { enabled = true, ...queryOptions } = options;

  const ky = useOkapiKy();

  const {
    data,
    isFetching,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [INVOICES_API, invoiceId],
    queryFn: ({ signal }) => ky.get(`${INVOICES_API}/${invoiceId}`, { signal }).json(),
    enabled: Boolean(enabled && invoiceId),
    ...queryOptions,
  });

  return ({
    invoice: data || DEFAULT_VALUE,
    isFetching,
    isLoading,
    refetch,
  });
};
