import { useQuery } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';
import {
  INVOICE_LINE_API,
  INVOICES_API, LIMIT_MAX,
} from '@folio/stripes-acq-components';

const DEFAULT_VALUE = [];

export const useInvoiceLinesByInvoiceId = (invoiceId) => {
  const ky = useOkapiKy();

  const searchParams = {
    limit: `${LIMIT_MAX}`,
    query: `(invoiceId==${invoiceId}) sortBy metadata.createdDate invoiceLineNumber`,
  };

  const { isLoading, data } = useQuery(
    [INVOICES_API, invoiceId],
    ({ signal }) => ky.get(`${INVOICE_LINE_API}`, { searchParams, signal }).json(),
    { enabled: Boolean(invoiceId) },
  );

  return ({
    isLoading,
    invoiceLines: data?.invoiceLines || DEFAULT_VALUE,
  });
};
