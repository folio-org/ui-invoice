import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  KeyValue,
  NoValue,
} from '@folio/stripes/components';

const PaymentTermsValue = ({ value }) => (
  <KeyValue
    label={<FormattedMessage id="ui-invoice.invoice.paymentTerms" />}
    value={value || <NoValue />}
  />
);

PaymentTermsValue.propTypes = {
  value: PropTypes.string,
};

export default PaymentTermsValue;
