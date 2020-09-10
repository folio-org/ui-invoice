import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { KeyValue } from '@folio/stripes/components';

const VoucherNumberValue = ({ value }) => (
  <KeyValue
    label={<FormattedMessage id="ui-invoice.invoice.details.voucher.voucherNumber" />}
    value={value}
  />
);

VoucherNumberValue.propTypes = {
  value: PropTypes.string.isRequired,
};

export default VoucherNumberValue;
