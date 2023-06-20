import { get } from 'lodash';
import { useVendors } from '../useVendors';

export const useDefaultAccountingCode = (voucher = {}, defaultReturnValue = '-') => {
  const { vendors, isLoading } = useVendors([voucher.vendorId]);

  const erpCode = get(vendors, [0, 'erpCode'], '');
  const isDefaultAccountingCode = voucher.accountingCode === erpCode;
  const accountNo = isDefaultAccountingCode ? defaultReturnValue : voucher.accountNo;

  return ({
    isLoading,
    erpCode,
    accountNo,
    isDefaultAccountingCode,
  });
};
