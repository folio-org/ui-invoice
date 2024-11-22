import { useQuery } from 'react-query';

import {
  useOkapiKy,
  useNamespace,
} from '@folio/stripes/core';

import { INVOICE_LINE_API } from '../../constants';

const DEFAULT_VALUE = {};

export const useInvoiceLine = (invoiceLineId) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'invoice-line' });

  const {
    data,
    isLoading,
    refetch,
  } = useQuery(
    [namespace, invoiceLineId],
    () => ky.get(`${INVOICE_LINE_API}/${invoiceLineId}`).json(),
    { enabled: Boolean(invoiceLineId) },
  );

  return ({
    invoiceLine: data || DEFAULT_VALUE,
    isLoading,
    refetch,
  });
};
