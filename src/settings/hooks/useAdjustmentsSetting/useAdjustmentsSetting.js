import { useInvoiceStorageSettingById } from '../../../common/hooks';

export const useAdjustmentsSetting = (id, options) => {
  return useInvoiceStorageSettingById(id, options);
};
