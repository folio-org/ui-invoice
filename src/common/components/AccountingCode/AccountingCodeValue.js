import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  KeyValue,
  NoValue,
} from '@folio/stripes/components';

const AccountingCodeValue = ({ value }) => (
  <KeyValue
    label={<FormattedMessage id="ui-invoice.invoice.accountingCode" />}
    value={value || <NoValue />}
  />
);

AccountingCodeValue.propTypes = {
  value: PropTypes.string,
};

export default AccountingCodeValue;
