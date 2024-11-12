import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

import { AUDIT_INVOICE_API } from '../../constants';

export const useInvoiceVersions = (invoiceId, options = {}) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'invoice-versions' });

  const { isLoading, data } = useQuery(
    [namespace, invoiceId],
    () => ky.get(`${AUDIT_INVOICE_API}/${invoiceId}`).json(),
    {
      enabled: Boolean(invoiceId),
      ...options,
    },
  );

  return {
    isLoading,
    versions: data?.invoiceAuditEvents || [],
  };
};
