import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

import { AUDIT_INVOICE_API } from '../../constants';

const DEFAULT_VALUE = [];

export const useInvoiceVersions = (invoiceId, options = {}) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'invoice-versions' });

  const searchParams = {
    sortBy: 'event_date',
    sortOrder: 'desc',
  };

  const { isLoading, data } = useQuery(
    [namespace, invoiceId],
    ({ signal }) => ky.get(`${AUDIT_INVOICE_API}/${invoiceId}`, { signal, searchParams }).json(),
    {
      enabled: Boolean(invoiceId),
      ...options,
    },
  );

  return {
    isLoading,
    versions: data?.invoiceAuditEvents || DEFAULT_VALUE,
  };
};
