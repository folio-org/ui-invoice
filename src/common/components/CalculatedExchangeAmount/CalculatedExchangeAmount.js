import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  AmountWithCurrencyField,
  VersionKeyValue,
} from '@folio/stripes-acq-components';
import { KeyValue } from '@folio/stripes/components';
import { useStripes } from '@folio/stripes/core';

import { useExchangeCalculation } from '../../hooks';

export const CalculatedExchangeAmount = ({
  currency,
  exchangeRate,
  isVersionView = false,
  name,
  total,
}) => {
  const stripes = useStripes();
  const systemCurrency = stripes.currency;
  const enabled = Boolean(systemCurrency !== currency && total);

  const { exchangedAmount } = useExchangeCalculation({
    amount: +total,
    from: currency,
    rate: +exchangeRate,
    to: systemCurrency,
  }, { enabled });

  const KeyValueComponent = isVersionView ? VersionKeyValue : KeyValue;

  if (!enabled) {
    return null;
  }

  return (
    <KeyValueComponent
      name={name}
      label={<FormattedMessage id="ui-invoice.invoice.details.information.calculatedTotalExchangeAmount" />}
    >
      <AmountWithCurrencyField
        amount={exchangedAmount || total}
        currency={systemCurrency}
      />
    </KeyValueComponent>
  );
};

CalculatedExchangeAmount.propTypes = {
  currency: PropTypes.string,
  exchangeRate: PropTypes.number,
  isVersionView: PropTypes.bool,
  name: PropTypes.string,
  total: PropTypes.number,
};
