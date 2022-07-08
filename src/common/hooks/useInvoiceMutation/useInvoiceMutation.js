import {
  useMutation,
} from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { INVOICES_API } from '@folio/stripes-acq-components';

export const useInvoiceMutation = (options = {}) => {
  const ky = useOkapiKy();

  const { mutateAsync } = useMutation({
    mutationFn: ({ invoice, ...mutateOptions } = {}) => {
      const defaultKyMethod = invoice.id ? 'put' : 'post';
      const kyMethod = mutateOptions.method || defaultKyMethod;
      const kyPath = invoice.id ? `${INVOICES_API}/${invoice.id}` : INVOICES_API;

      return ky[kyMethod](kyPath, { json: invoice });
    },
    ...options,
  });

  return {
    mutateInvoice: mutateAsync,
  };
};
