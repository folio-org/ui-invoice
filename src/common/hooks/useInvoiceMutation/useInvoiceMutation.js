import {
  useMutation,
} from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { INVOICES_API } from '@folio/stripes-acq-components';

export const useInvoiceMutation = (options = {}) => {
  const ky = useOkapiKy();

  const { mutateAsync } = useMutation({
    mutationFn: ({ invoice, searchParams = {} }) => {
      const kyMethod = invoice.id ? 'put' : 'post';
      const kyPath = invoice.id ? `${INVOICES_API}/${invoice.id}` : INVOICES_API;

      return ky[kyMethod](kyPath, { json: invoice, searchParams }).json();
    },
    ...options,
  });

  const { mutateAsync: deleteInvoice } = useMutation({
    mutationFn: (id) => {
      return ky.delete(`${INVOICES_API}/${id}`);
    },
    ...options,
  });

  return {
    mutateInvoice: mutateAsync,
    deleteInvoice,
  };
};
