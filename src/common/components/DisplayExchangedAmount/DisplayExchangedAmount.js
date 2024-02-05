import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { AmountWithCurrencyField } from '@folio/stripes-acq-components';
import { KeyValue } from '@folio/stripes/components';
import { useStripes } from '@folio/stripes/core';

import { useExchangeCalculation } from '../../hooks';

export const DisplayExchangedAmount = ({ currency, exchangeRate, total }) => {
  const stripes = useStripes();

  const systemCurrency = stripes.currency;
  const enabled = systemCurrency !== currency;

  const { exchangedAmount } = useExchangeCalculation({
    to: systemCurrency,
    from: currency,
    amount: +total,
    rate: +exchangeRate,
  },
  { enabled });

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

DisplayExchangedAmount.propTypes = {
  currency: PropTypes.string,
  exchangeRate: PropTypes.number,
  total: PropTypes.number,
};
