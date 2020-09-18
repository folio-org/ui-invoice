import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  KeyValue,
  NoValue,
} from '@folio/stripes/components';

const BillToValue = ({ value }) => (
  <KeyValue
    label={<FormattedMessage id="ui-invoice.invoice.billToName" />}
    value={value || <NoValue />}
  />
);

BillToValue.propTypes = {
  value: PropTypes.string,
};

export default BillToValue;
