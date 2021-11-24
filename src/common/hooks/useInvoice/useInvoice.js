import { useQuery } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { INVOICES_API } from '@folio/stripes-acq-components';

export const useInvoice = (invoiceId) => {
  const ky = useOkapiKy();

  const { isLoading: isInvoiceLoading, data: invoice = {} } = useQuery(
    [INVOICES_API, invoiceId],
    () => ky.get(`${INVOICES_API}/${invoiceId}`).json(),
    { enabled: Boolean(invoiceId) },
  );

  return ({
    isInvoiceLoading,
    invoice,
  });
};
