import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { KeyValue } from '@folio/stripes/components';

import { getInvoiceStatusLabel } from '../../utils';

const StatusValue = ({ value }) => (
  <KeyValue label={<FormattedMessage id="ui-invoice.invoice.details.information.status" />}>
    <FormattedMessage id={getInvoiceStatusLabel({ status: value })} />
  </KeyValue>
);

StatusValue.propTypes = {
  value: PropTypes.string.isRequired,
};

export default StatusValue;
