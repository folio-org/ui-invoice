import React, {
  useState,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';

import { stripesConnect } from '@folio/stripes/core';
import {
  KeyValue,
  Label,
  Loading,
} from '@folio/stripes/components';

import { EXCHANGE_RATE_API } from '../../../common/constants/api';

const CurrentExchangeRate = ({
  label,
  exchangeFrom,
  exchangeTo,
  mutator,
  setExchangeRateRequired,
  setExchangeRateEnabled,
}) => {
  const [exchangeRate, setExchangeRate] = useState();

  useEffect(
    () => {
      setExchangeRate();
      setExchangeRateRequired(false);
      setExchangeRateEnabled(false);

      if (exchangeFrom !== exchangeTo) {
        mutator.exchangeRate.GET({
          params: {
            from: exchangeFrom,
            to: exchangeTo,
          },
        })
          .then(setExchangeRate)
          .catch(() => {
            setExchangeRate({});
            setExchangeRateRequired(true);
            setExchangeRateEnabled(true);
          });
      } else setExchangeRate({});
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [exchangeFrom, exchangeTo, setExchangeRateRequired, setExchangeRateEnabled],
  );

  if (!exchangeRate) {
    return (
      <>
        <Label>
          {label}
        </Label>
        <Loading />
      </>
    );
  }

  return (
    <KeyValue
      data-testid="current-exchange-rate"
      label={label}
      value={exchangeRate.exchangeRate}
    />
  );
};

CurrentExchangeRate.manifest = Object.freeze({
  exchangeRate: {
    accumulate: true,
    fetch: false,
    throwErrors: false,
    type: 'okapi',
    path: EXCHANGE_RATE_API,
  },
});

CurrentExchangeRate.propTypes = {
  exchangeFrom: PropTypes.string.isRequired,
  exchangeTo: PropTypes.string.isRequired,
  label: PropTypes.node.isRequired,
  mutator: PropTypes.object.isRequired,
  setExchangeRateRequired: PropTypes.func.isRequired,
  setExchangeRateEnabled: PropTypes.func.isRequired,
};

export default stripesConnect(CurrentExchangeRate);
