import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

import { ADJUSTMENTS_PRESETS_API } from '../../../common/constants';

export const useAdjustmentsSetting = (id, options = {}) => {
  const {
    enabled = true,
    tenantId,
    ...queryOptions
  } = options;

  const ky = useOkapiKy({ tenant: tenantId });
  const [namespace] = useNamespace({ key: 'invoice-storage-settings-by-id' });

  const { data, ...rest } = useQuery({
    queryKey: [namespace, tenantId],
    queryFn: ({ signal }) => ky.get(`${ADJUSTMENTS_PRESETS_API}/${id}`, { signal }).json(),
    enabled: enabled && Boolean(id),
    ...queryOptions,
  });

  return ({
    adjustmentPreset: data,
    ...rest,
  });
};
