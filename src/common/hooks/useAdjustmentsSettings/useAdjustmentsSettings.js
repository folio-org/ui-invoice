import { CONFIG_NAME_ADJUSTMENTS } from '../../constants';
import { useInvoiceStorageSettings } from '../useInvoiceStorageSettings';

export const useAdjustmentsSettings = () => {
  return useInvoiceStorageSettings({ key: CONFIG_NAME_ADJUSTMENTS });
};
