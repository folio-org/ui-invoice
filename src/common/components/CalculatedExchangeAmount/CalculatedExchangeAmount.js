import { debounce } from 'lodash';
import PropTypes from 'prop-types';
import {
  useCallback,
  useEffect,
  useState,
} from 'react';
import { FormattedMessage } from 'react-intl';

import { AmountWithCurrencyField } from '@folio/stripes-acq-components';
import { KeyValue } from '@folio/stripes/components';
import { useStripes } from '@folio/stripes/core';

import { useExchangeCalculation } from '../../hooks';

const DEBOUNCE_DELAY = 500;

export const CalculatedExchangeAmount = ({ currency, exchangeRate, total }) => {
  const stripes = useStripes();
  const systemCurrency = stripes.currency;
  const enabled = Boolean(systemCurrency !== currency && total);

  const [exchangeProps, setExchangeProps] = useState({
    to: systemCurrency,
    from: currency,
    amount: total,
    rate: exchangeRate,
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSave = useCallback(debounce(() => {
    setExchangeProps({
      to: systemCurrency,
      from: currency,
      amount: +total,
      rate: +exchangeRate,
    });
  }, DEBOUNCE_DELAY), [currency, exchangeRate, systemCurrency, total]);

  useEffect(() => {
    debouncedSave();

    return () => debouncedSave.cancel();
  }, [currency, debouncedSave, exchangeRate, total]);

  const { exchangedAmount } = useExchangeCalculation(exchangeProps, { enabled });

  if (!enabled) {
    return null;
  }

  return (
    <KeyValue label={<FormattedMessage id="ui-invoice.invoice.details.information.calculatedTotalExchangeAmount" />}>
      <AmountWithCurrencyField
        amount={exchangedAmount || total}
        currency={systemCurrency}
      />
    </KeyValue>
  );
};

CalculatedExchangeAmount.propTypes = {
  currency: PropTypes.string,
  exchangeRate: PropTypes.number,
  total: PropTypes.number,
};
