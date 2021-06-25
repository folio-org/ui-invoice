import {
  useMutation,
} from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import {
  INVOICE_LINE_API,
} from '../../constants';

export const useInvoiceLineMutation = (options = {}) => {
  const ky = useOkapiKy();

  const { mutateAsync } = useMutation({
    mutationFn: (invoiceLine) => {
      const kyMethod = invoiceLine.id ? 'put' : 'post';
      const kyPath = invoiceLine.id ? `${INVOICE_LINE_API}/${invoiceLine.id}` : INVOICE_LINE_API;

      return ky[kyMethod](kyPath, { json: invoiceLine });
    },
    ...options,
  });

  return {
    mutateInvoiceLine: mutateAsync,
  };
};
