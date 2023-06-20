import { useMemo } from 'react';

import {
  useBatchGroup,
  useDefaultAccountingCode,
  useVoucherByInvoiceId,
  useVoucherLines,
} from '../../common/hooks';
import { useVendor } from '../Voucher/VendorAddress/useVendor';

const usePrintData = (invoice = {}) => {
  const { isVoucherLoading, voucher } = useVoucherByInvoiceId(invoice.id);
  const { isVoucherLinesLoading, voucherLines } = useVoucherLines(voucher.id);
  const { isBatchGroupLoading, batchGroup } = useBatchGroup(voucher.batchGroupId);
  const { vendor, isLoading: isLoadingVendor } = useVendor(voucher.vendorId);
  const { isLoading: isDefaultAccountingCodeLoading, accountNo } = useDefaultAccountingCode(voucher);

  const dataSource = useMemo(() => {
    return {
      batchGroup,
      invoice,
      vendor,
      voucher: {
        ...voucher,
        accountNo,
      },
      voucherLines,
    };
  }, [batchGroup, invoice, vendor, voucher, voucherLines, accountNo]);

  const isLoading = isVoucherLoading
  || isVoucherLinesLoading
  || isBatchGroupLoading
  || isLoadingVendor
  || isDefaultAccountingCodeLoading;

  return ({
    dataSource,
    isLoading,
  });
};

export default usePrintData;
