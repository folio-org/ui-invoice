import { useQuery } from 'react-query';

import {
  useOkapiKy,
  useNamespace,
} from '@folio/stripes/core';

import { INVOICE_LINE_API } from '../../constants';

export const useInvoiceLine = (invoiceLineId) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'invoice-line' });

  const { data: invoiceLine, isLoading, refetch } = useQuery(
    [namespace, invoiceLineId],
    () => ky.get(`${INVOICE_LINE_API}/${invoiceLineId}`).json(),
    { enabled: Boolean(invoiceLineId) },
  );

  return ({
    invoiceLine,
    isLoading,
    refetch,
  });
};
