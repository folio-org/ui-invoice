import { useQuery } from 'react-query';

import {
  useOkapiKy,
  useNamespace,
} from '@folio/stripes/core';
import { LIMIT_MAX } from '@folio/stripes-acq-components';

import { FISCAL_YEARS_API } from '../../constants';

const INITIAL_DATA = [];

export const usePayableFiscalYears = (options = {}) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'invoice-payable-fiscal-years' });

  const periodStart = new Date().toISOString();
  const searchParams = {
    limit: LIMIT_MAX,
    query: `periodStart<="${periodStart}" sortby periodStart/sort.descending`,
  };

  const { data, ...rest } = useQuery(
    [namespace],
    ({ signal }) => ky.get(FISCAL_YEARS_API, { searchParams, signal }).json(),
    options,
  );

  return ({
    fiscalYears: data?.fiscalYears || INITIAL_DATA,
    totalRecords: data?.totalRecords,
    ...rest,
  });
};
