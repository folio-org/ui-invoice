import { useMutation } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { INVOICE_STORAGE_SETTINGS_API } from '../../../common/constants';

export const useInvoiceStorageSettingsMutation = (options = {}) => {
  const { tenantId } = options;
  const ky = useOkapiKy({ tenant: tenantId });

  const {
    mutateAsync: upsertSetting,
    isLoading: isMutating,
  } = useMutation({
    mutationFn: async ({ data }) => {
      return data?.id
        ? ky.put(`${INVOICE_STORAGE_SETTINGS_API}/${data?.id}`, { json: data })
        : ky.post(INVOICE_STORAGE_SETTINGS_API, { json: data }).json();
    },
  });

  const {
    mutateAsync: deleteSetting,
    isLoading: isDeleting,
  } = useMutation({
    mutationFn: async ({ id }) => {
      return ky.delete(`${INVOICE_STORAGE_SETTINGS_API}/${id}`);
    },
  });

  return {
    deleteSetting,
    isLoading: isMutating || isDeleting,
    upsertSetting,
  };
};
