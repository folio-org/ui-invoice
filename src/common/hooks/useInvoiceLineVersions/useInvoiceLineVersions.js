import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

import { AUDIT_INVOICE_LINE_API } from '../../constants';

const DEFAULT_VALUE = [];

export const useInvoiceLineVersions = (invoiceLineId, options = {}) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'invoice-line-versions' });

  const searchParams = {
    sortBy: 'event_date',
    sortOrder: 'desc',
  };

  const { isLoading, data } = useQuery(
    [namespace, invoiceLineId],
    ({ signal }) => ky.get(`${AUDIT_INVOICE_LINE_API}/${invoiceLineId}`, { signal, searchParams }).json(),
    {
      enabled: Boolean(invoiceLineId),
      ...options,
    },
  );

  return {
    isLoading,
    versions: data?.invoiceLineAuditEvents || DEFAULT_VALUE,
  };
};
