import { useQuery } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { VOUCHERS_API } from '../../constants';

export const useVoucherById = (voucherId) => {
  const ky = useOkapiKy();

  const { isLoading: isVoucherLoading, data: voucher = {} } = useQuery(
    [VOUCHERS_API, voucherId],
    () => ky.get(`${VOUCHERS_API}/${voucherId}`).json(),
    { enabled: Boolean(voucherId) },
  );

  return ({
    isVoucherLoading,
    voucher,
  });
};
