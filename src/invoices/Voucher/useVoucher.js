import {
  useInvoice,
  useVoucherById,
  useVoucherLines,
} from '../../common/hooks';

export const useVoucher = (invoiceId, voucherId) => {
  const { isVoucherLoading, voucher } = useVoucherById(voucherId);

  const { isVoucherLinesLoading, voucherLines } = useVoucherLines(voucherId);

  const { isInvoiceLoading, invoice } = useInvoice(invoiceId);

  return ({
    isLoading: isVoucherLoading || isVoucherLinesLoading || isInvoiceLoading,
    voucher,
    voucherLines,
    invoice,
  });
};
