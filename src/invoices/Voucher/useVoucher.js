import { useQuery } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import {
  INVOICE_API,
  VOUCHERS_API,
  VOUCHER_LINES_API,
} from '../../common/constants';

export const useVoucher = (invoiceId, voucherId) => {
  const ky = useOkapiKy();

  const { isLoading: isVoucherLoading, data: voucher = {} } = useQuery(
    [VOUCHERS_API, voucherId],
    () => ky.get(`${VOUCHERS_API}/${voucherId}`).json(),
  );

  const { isLoading: isVoucherLinesLoading, data } = useQuery(
    [VOUCHER_LINES_API, voucherId],
    () => ky.get(`${VOUCHER_LINES_API}`, { query: `voucherId==${voucherId}` }).json(),
  );

  const { isLoading: isInvoiceLoading, data: invoice = {} } = useQuery(
    [INVOICE_API, invoiceId],
    () => ky.get(`${INVOICE_API}/${invoiceId}`, { query: `voucherId==${voucherId}` }).json(),
  );

  return ({
    isLoading: isVoucherLoading || isVoucherLinesLoading || isInvoiceLoading,
    voucher,
    voucherLines: data?.voucherLines || [],
    invoice,
  });
};
