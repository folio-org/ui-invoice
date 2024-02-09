import { useQuery } from 'react-query';

import {
  useOkapiKy,
  useNamespace,
} from '@folio/stripes/core';

import { CALCULATE_EXCHANGE_API } from '../../constants';

export const useExchangeCalculation = ({ from, to, amount, rate }, options = {}) => {
  const { enabled = true, ...otherOptions } = options;
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'exchange-calculation' });

  const searchParams = {
    from,
    to,
    amount,
    rate,
  };

  const { data, isLoading, isFetching } = useQuery(
    [namespace, amount, rate, from, to],
    ({ signal }) => ky.get(`${CALCULATE_EXCHANGE_API}`, { searchParams, signal }).json(),
    {
      keepPreviousData: true,
      ...otherOptions,
      enabled: enabled && Boolean(amount && from && to && rate),
    },
  );

  return ({
    exchangedAmount: data,
    isFetching,
    isLoading,
  });
};
