import { useMutation } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { ADJUSTMENTS_PRESETS_API } from '../../../common/constants';

export const useAdjustmentsSettingsMutation = (options = {}) => {
  const { tenantId } = options;
  const ky = useOkapiKy({ tenant: tenantId });

  const {
    mutateAsync: createSetting,
    isLoading: isCreateLoading,
  } = useMutation({
    mutationFn: async ({ data }) => ky.post(ADJUSTMENTS_PRESETS_API, { json: data }).json(),
  });

  const {
    mutateAsync: updateSetting,
    isLoading: isUpdateLoading,
  } = useMutation({
    mutationFn: async ({ data }) => ky.put(`${ADJUSTMENTS_PRESETS_API}/${data?.id}`, { json: data }),
  });

  const {
    mutateAsync: deleteSetting,
    isLoading: isDeleteLoading,
  } = useMutation({
    mutationFn: async ({ id }) => ky.delete(`${ADJUSTMENTS_PRESETS_API}/${id}`),
  });

  return {
    createSetting,
    deleteSetting,
    updateSetting,
    isCreateLoading,
    isUpdateLoading,
    isDeleteLoading,
  };
};
