import { useQuery } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { INVOICES_API } from '@folio/stripes-acq-components';

const DEFAULT_VALUE = {};

export const useInvoice = (invoiceId) => {
  const ky = useOkapiKy();

  const { isLoading, data } = useQuery(
    [INVOICES_API, invoiceId],
    () => ky.get(`${INVOICES_API}/${invoiceId}`).json(),
    { enabled: Boolean(invoiceId) },
  );

  return ({
    isLoading,
    invoice: data || DEFAULT_VALUE,
  });
};
