import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { KeyValue } from '@folio/stripes/components';

const CurrencyValue = ({ value }) => (
  <KeyValue
    label={<FormattedMessage id="ui-invoice.invoice.currency" />}
    value={value}
  />
);

CurrencyValue.propTypes = {
  value: PropTypes.string.isRequired,
};

export default CurrencyValue;
