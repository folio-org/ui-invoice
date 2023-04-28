import { useQuery } from 'react-query';

import {
  useOkapiKy,
  useNamespace,
} from '@folio/stripes/core';
import { FISCAL_YEARS_API } from '../../constants';

const INITIAL_DATA = {};

export const useFiscalYear = (fiscalYearId, options = {}) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'fiscal-year' });

  const { data = INITIAL_DATA, ...rest } = useQuery(
    [namespace, fiscalYearId],
    ({ signal }) => ky.get(`${FISCAL_YEARS_API}/${fiscalYearId}`, { signal }).json(),
    {
      enabled: Boolean(fiscalYearId),
      ...options,
    },
  );

  return ({
    fiscalYear: data,
    ...rest,
  });
};
