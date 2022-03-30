import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

import { BATCH_VOUCHER_EXPORTS_API } from '../../../../common/constants';

export const useBatchVoucherExports = (
  batchGroupId,
  pagination = {},
  sorting = {},
) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'batch-voucher-exports' });

  const getSortingQuery = ({ sortingField, sortingDirection }) => {
    const direction = sortingDirection || 'descending';

    return sortingField === 'date'
      ? `sortby end/sort.${direction} start/sort.${direction}`
      : null;
  };

  const searchParams = {
    limit: pagination.limit,
    offset: pagination.offset,
    query: [
      `batchGroupId==${batchGroupId}`,
      getSortingQuery(sorting) || 'sortby end/sort.descending start/sort.descending',
    ].join(' '),
  };

  const queryKey = [
    batchGroupId,
    namespace,
    pagination.offset,
    pagination.limit,
    sorting.sortingDirection,
    sorting.sortingField,
  ];

  const queryFn = () => ky.get(BATCH_VOUCHER_EXPORTS_API, { searchParams }).json();

  const options = {
    enabled: Boolean(batchGroupId),
  };

  const { data, isFetching, isLoading, refetch } = useQuery({
    queryKey,
    queryFn,
    ...options,
  });

  return {
    batchVoucherExports: data?.batchVoucherExports || [],
    totalRecords: data?.totalRecords,
    isFetching,
    isLoading,
    refetch,
  };
};
