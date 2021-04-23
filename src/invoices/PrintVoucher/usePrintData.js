import { useMemo } from 'react';

import {
  useBatchGroup,
  useVoucherByInvoiceId,
  useVoucherLines,
} from '../../common/hooks';
import { useVendor } from '../Voucher/VendorAddress/useVendor';

const usePrintData = (invoice = {}) => {
  const { isVoucherLoading, voucher } = useVoucherByInvoiceId(invoice.id);
  const { isVoucherLinesLoading, voucherLines } = useVoucherLines(voucher.id);
  const { isBatchGroupLoading, batchGroup } = useBatchGroup(voucher.batchGroupId);
  const { vendor, isLoading: isLoadingVendor } = useVendor(voucher.vendorId);

  const dataSource = useMemo(() => {
    return {
      batchGroup,
      invoice,
      vendor,
      voucher,
      voucherLines,
    };
  }, [batchGroup, invoice, vendor, voucher, voucherLines]);

  return ({
    dataSource,
    isLoading: isVoucherLoading || isVoucherLinesLoading || isBatchGroupLoading || isLoadingVendor,
  });
};

export default usePrintData;
