import { useQuery } from 'react-query';

import { useNamespace, useOkapiKy } from '@folio/stripes/core';
import { CONFIG_API, LIMIT_MAX } from '@folio/stripes-acq-components';

import {
  CONFIG_MODULE_INVOICE,
  CONFIG_NAME_ADJUSTMENTS,
} from '../../constants';

export const useConfigsAdjustments = (options = {}) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'configurations-invoice-adjustments' });

  const searchParams = {
    limit: LIMIT_MAX,
    query: `(module=${CONFIG_MODULE_INVOICE} and configName=${CONFIG_NAME_ADJUSTMENTS}) sortby code`,
  };

  const { isLoading, data } = useQuery(
    [namespace],
    () => ky.get(CONFIG_API, { searchParams }).json(),
    options,
  );

  return ({
    isLoading,
    adjustments: data?.configs || [],
  });
};
