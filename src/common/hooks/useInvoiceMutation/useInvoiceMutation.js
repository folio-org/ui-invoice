import {
  useMutation,
} from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { INVOICES_API } from '@folio/stripes-acq-components';

export const useInvoiceMutation = (options = {}) => {
  const ky = useOkapiKy();

  const { mutateAsync } = useMutation({
    mutationFn: (invoice) => {
      const kyMethod = invoice.id ? 'put' : 'post';
      const kyPath = invoice.id ? `${INVOICES_API}/${invoice.id}` : INVOICES_API;

      return ky[kyMethod](kyPath, { json: invoice });
    },
    ...options,
  });

  return {
    mutateInvoice: mutateAsync,
  };
};
