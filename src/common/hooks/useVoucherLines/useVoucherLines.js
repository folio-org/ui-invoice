import { useQuery } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { VOUCHER_LINES_API } from '../../constants';

export const useVoucherLines = (voucherId) => {
  const ky = useOkapiKy();

  const { isLoading: isVoucherLinesLoading, data } = useQuery(
    [VOUCHER_LINES_API, voucherId],
    () => ky.get(VOUCHER_LINES_API, { searchParams: { query: `voucherId==${voucherId}` } }).json(),
    { enabled: Boolean(voucherId) },
  );

  return ({
    isVoucherLinesLoading,
    voucherLines: data?.voucherLines || [],
  });
};
