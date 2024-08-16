import { useMutation } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { INVOICE_LINE_API } from '../../constants';

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

  const { mutateAsync: createInvoiceLines } = useMutation({
    mutationFn: async ({ invoiceLines = [], options: kyOptions = {} }) => {
      const results = [];

      for (const data of invoiceLines) {
        try {
          const response = await ky.post(INVOICE_LINE_API, {
            json: data,
            ...kyOptions,
          }).json();

          results.push({ status: 'fulfilled', value: response });
        } catch (error) {
          results.push({ status: 'rejected', reason: error });
        }
      }

      return results;
    },
    ...options,
  });

  return {
    mutateInvoiceLine: mutateAsync,
    createInvoiceLines,
  };
};
