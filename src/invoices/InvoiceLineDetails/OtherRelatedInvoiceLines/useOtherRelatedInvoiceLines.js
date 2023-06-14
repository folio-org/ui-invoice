import { useQuery } from 'react-query';
import { keyBy } from 'lodash';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';
import {
  batchRequest,
  INVOICES_API,
  LIMIT_MAX,
  VENDORS_API,
} from '@folio/stripes-acq-components';

import { INVOICE_LINE_API } from '../../../common/constants';

export const useOtherRelatedInvoiceLines = (
  invoiceLineId,
  poLineId,
) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'other-related-invoice-lines' });

  const { isLoading, data = [] } = useQuery(
    [namespace, invoiceLineId, poLineId],
    async () => {
      const { invoiceLines = [], totalRecords } = await ky.get(INVOICE_LINE_API, {
        searchParams: {
          query: `id<>${invoiceLineId} and poLineId==${poLineId}`,
          limit: LIMIT_MAX,
        },
      }).json();

      const invoicesIds = invoiceLines.map(({ invoiceId }) => invoiceId);
      const invoices = await batchRequest(
        async ({ params: searchParams }) => {
          const invoicesData = await ky.get(INVOICES_API, { searchParams }).json();

          return invoicesData.invoices;
        },
        invoicesIds,
      );
      const invoicesMap = keyBy(invoices, 'id');

      const vendorIds = invoices.map(({ vendorId }) => vendorId);
      const vendors = await batchRequest(
        async ({ params: searchParams }) => {
          const vendorsData = await ky.get(VENDORS_API, { searchParams }).json();

          return vendorsData.organizations;
        },
        vendorIds,
      );
      const vendorsMap = keyBy(vendors, 'id');

      const result = invoiceLines.map(invoiceLine => {
        const invoice = invoicesMap[invoiceLine.invoiceId];
        const vendor = vendorsMap[invoice.vendorId];

        return {
          ...invoiceLine,
          invoice,
          vendor,
        };
      });

      return {
        invoiceLines: result,
        totalInvoiceLines: totalRecords,
      };
    },
    { enabled: Boolean(invoiceLineId && poLineId) },
  );

  return {
    isLoading,
    invoiceLines: data.invoiceLines,
    totalInvoiceLines: data.totalInvoiceLines,
  };
};
