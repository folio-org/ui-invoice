import { useQuery } from 'react-query';
import { useLocation } from 'react-router';
import queryString from 'query-string';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';
import {
  getFiltersCount,
  INVOICES_API,
} from '@folio/stripes-acq-components';

import { useBuildQuery } from '../useBuildQuery';

export const useInvoices = ({ pagination, fetchVendors }) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'invoices-list' });

  const { search } = useLocation();
  const buildQuery = useBuildQuery();
  const queryParams = queryString.parse(search);
  const query = buildQuery(queryParams);
  const filtersCount = getFiltersCount(queryParams);

  const searchParams = {
    query,
    limit: pagination.limit,
    offset: pagination.offset,
  };

  const { isFetching, data = {} } = useQuery(
    [namespace, pagination.timestamp, pagination.limit, pagination.offset],
    async () => {
      if (!filtersCount) {
        return { invoices: [], invoicesCount: 0 };
      }

      const { invoices, totalRecords } = await ky.get(INVOICES_API, { searchParams }).json();
      const vendorsMap = await fetchVendors(invoices);
      const hydratedInvoices = invoices.map(invoice => ({
        ...invoice,
        vendor: vendorsMap[invoice.vendorId],
      }));

      return {
        invoices: hydratedInvoices,
        invoicesCount: totalRecords,
        query,
      };
    },
    {
      enabled: Boolean(pagination.timestamp),
      keepPreviousData: true,
    },
  );

  return ({
    ...data,
    isFetching,
  });
};
