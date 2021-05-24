import {
  useMutation,
} from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import {
  INVOICE_API,
} from '../../constants';

export const useInvoiceMutation = (options = {}) => {
  const ky = useOkapiKy();

  const { mutateAsync } = useMutation({
    mutationFn: (invoice) => {
      const kyMethod = invoice.id ? 'put' : 'post';
      const kyPath = invoice.id ? `${INVOICE_API}/${invoice.id}` : INVOICE_API;

      return ky[kyMethod](kyPath, { json: invoice });
    },
    ...options,
  });

  return {
    mutateInvoice: mutateAsync,
  };
};
