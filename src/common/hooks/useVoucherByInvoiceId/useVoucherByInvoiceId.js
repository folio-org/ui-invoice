import { useQuery } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { VOUCHERS_API } from '../../constants';

export const useVoucherByInvoiceId = (invoiceId) => {
  const ky = useOkapiKy();
  const searchParams = { query: `invoiceId==${invoiceId}` };

  const { isLoading: isVoucherLoading, data } = useQuery(
    [VOUCHERS_API, invoiceId],
    () => ky.get(VOUCHERS_API, { searchParams }).json(),
    { enabled: Boolean(invoiceId) },
  );

  return ({
    isVoucherLoading,
    voucher: data?.vouchers?.[0] || {},
  });
};
