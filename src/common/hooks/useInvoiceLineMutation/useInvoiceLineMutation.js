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
    mutationFn: ({ data, options: kyOptions = {} }) => {
      const kyMethod = data?.id ? 'put' : 'post';
      const kyPath = data?.id ? `${INVOICE_LINE_API}/${data.id}` : INVOICE_LINE_API;

      return ky(kyPath, {
        method: kyMethod,
        json: data,
        ...kyOptions,
      });
    },
    ...options,
  });

  return {
    mutateInvoiceLine: mutateAsync,
  };
};
