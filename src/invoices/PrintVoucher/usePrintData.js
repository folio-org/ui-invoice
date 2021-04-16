import { useMemo } from 'react';

import {
  useBatchGroup,
  useVoucherByInvoiceId,
  useVoucherLines,
} from '../../common/hooks';

const usePrintData = (invoice = {}) => {
  const { isVoucherLoading, voucher } = useVoucherByInvoiceId(invoice.id);
  const { isVoucherLinesLoading, voucherLines } = useVoucherLines(voucher.id);
  const { isBatchGroupLoading, batchGroup } = useBatchGroup(voucher.batchGroupId);

  const dataSource = useMemo(() => {
    return {
      batchGroup,
      invoice,
      voucher,
      voucherLines,
    };
  }, [batchGroup, invoice, voucher, voucherLines]);

  return ({
    dataSource,
    isLoading: isVoucherLoading || isVoucherLinesLoading || isBatchGroupLoading,
  });
};

export default usePrintData;
