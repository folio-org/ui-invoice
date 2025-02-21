import { useQuery } from 'react-query';

import {
  useOkapiKy,
  useNamespace,
} from '@folio/stripes/core';

import { INVOICE_LINE_API } from '../../constants';

const DEFAULT_VALUE = {};

export const useInvoiceLine = (invoiceLineId, options = {}) => {
  const { enabled = true, ...queryOptions } = options;

  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'invoice-line' });

  const {
    data,
    isFetching,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [namespace, invoiceLineId],
    queryFn: ({ signal }) => ky.get(`${INVOICE_LINE_API}/${invoiceLineId}`, { signal }).json(),
    enabled: Boolean(enabled && invoiceLineId),
    ...queryOptions,
  });

  return ({
    invoiceLine: data || DEFAULT_VALUE,
    isFetching,
    isLoading,
    refetch,
  });
};
