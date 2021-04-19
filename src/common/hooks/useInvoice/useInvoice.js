import { useQuery } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { INVOICE_API } from '../../constants';

export const useInvoice = (invoiceId) => {
  const ky = useOkapiKy();

  const { isLoading: isInvoiceLoading, data: invoice = {} } = useQuery(
    [INVOICE_API, invoiceId],
    () => ky.get(`${INVOICE_API}/${invoiceId}`).json(),
    { enabled: Boolean(invoiceId) },
  );

  return ({
    isInvoiceLoading,
    invoice,
  });
};
