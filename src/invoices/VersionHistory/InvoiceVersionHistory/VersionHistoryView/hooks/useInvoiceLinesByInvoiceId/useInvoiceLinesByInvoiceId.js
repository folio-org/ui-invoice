import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';
import {
  INVOICE_LINE_API,
  LIMIT_MAX,
} from '@folio/stripes-acq-components';

const DEFAULT_VALUE = [];

export const useInvoiceLinesByInvoiceId = (invoiceId) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'invoiceLines-by-invoiceId' });

  const searchParams = {
    limit: `${LIMIT_MAX}`,
    query: `(invoiceId==${invoiceId}) sortBy metadata.createdDate invoiceLineNumber`,
  };

  const { isLoading, data } = useQuery(
    [namespace, invoiceId],
    ({ signal }) => ky.get(`${INVOICE_LINE_API}`, { searchParams, signal }).json(),
    { enabled: Boolean(invoiceId) },
  );

  return ({
    isLoading,
    invoiceLines: data?.invoiceLines || DEFAULT_VALUE,
  });
};
