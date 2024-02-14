import { debounce } from 'lodash';
import {
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useQuery } from 'react-query';

import { useExchangeRateValue } from '@folio/stripes-acq-components';
import {
  useOkapiKy,
  useNamespace,
} from '@folio/stripes/core';

import { CALCULATE_EXCHANGE_API } from '../../constants';

const DEBOUNCE_DELAY = 500;

export const useExchangeCalculation = ({ from, to, amount, rate }, options = {}) => {
  const { enabled = true, ...otherOptions } = options;
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'exchange-calculation' });

  const { exchangeRate } = useExchangeRateValue(
    from,
    to,
    rate,
  );

  const [searchParams, setSearchParams] = useState({
    amount,
    from,
    rate: rate || exchangeRate,
    to,
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceSetSearchParams = useCallback(debounce(() => {
    setSearchParams({
      amount,
      from,
      rate: rate || exchangeRate,
      to,
    });
  }, DEBOUNCE_DELAY), [amount, from, rate, to, exchangeRate]);

  useEffect(() => {
    debounceSetSearchParams();

    return () => debounceSetSearchParams.cancel();
  }, [amount, debounceSetSearchParams, from, rate, to, exchangeRate]);

  const {
    amount: amountProp,
    from: fromProp,
    rate: rateProp,
    to: toProp,
  } = searchParams;

  const { data, isLoading, isFetching } = useQuery(
    [namespace, amountProp, fromProp, rateProp, toProp],
    ({ signal }) => ky.get(`${CALCULATE_EXCHANGE_API}`, { searchParams, signal }).json(),
    {
      keepPreviousData: true,
      ...otherOptions,
      enabled: enabled && Boolean(amountProp && fromProp && rateProp && toProp),
    },
  );

  return ({
    exchangedAmount: data,
    isFetching,
    isLoading,
  });
};
