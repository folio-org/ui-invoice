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

function getSortQuery(sorting) {
  const { sortingField = 'invoiceDate', sortingDirection = 'descending' } = sorting;

  if (!sortingField || !sortingDirection) return '';

  if (sortingField === 'invoiceDate') {
    return `sortby metadata.createdDate/sort.${sortingDirection}`;
  }

  return `sortby ${sortingField}/sort.${sortingDirection}`;
}

export const useOtherRelatedInvoiceLines = ({
  invoiceLineId,
  poLineId,
  pagination = {},
  sorting = {},
}) => {
  const { limit = LIMIT_MAX, offset = 0 } = pagination;

  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'other-related-invoice-lines' });

  const { isLoading, data = [], isFetching } = useQuery(
    [namespace, invoiceLineId, poLineId, limit, offset, sorting.sortingDirection,
      sorting.sortingField],
    async () => {
      const { invoiceLines = [], totalRecords } = await ky.get(INVOICE_LINE_API, {
        searchParams: {
          query: [
            `id<>${invoiceLineId} and poLineId==${poLineId}`,
            getSortQuery(sorting),
          ].join(' '),
          limit,
          offset,
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
    isFetching,
    invoiceLines: data.invoiceLines,
    totalInvoiceLines: data.totalInvoiceLines,
  };
};
