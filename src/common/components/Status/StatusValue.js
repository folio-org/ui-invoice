import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { KeyValue } from '@folio/stripes/components';
import { VersionKeyValue } from '@folio/stripes-acq-components';

import { getInvoiceStatusLabel } from '../../utils';

const StatusValue = ({ isVersionView, name, value }) => {
  const KeyValueComponent = isVersionView ? VersionKeyValue : KeyValue;

  return (
    <KeyValueComponent
      label={<FormattedMessage id="ui-invoice.invoice.details.information.status" />}
      name={name}
    >
      <FormattedMessage id={getInvoiceStatusLabel({ status: value })} />
    </KeyValueComponent>
  );
};

StatusValue.propTypes = {
  isVersionView: PropTypes.bool,
  name: PropTypes.string,
  value: PropTypes.string.isRequired,
};

export default StatusValue;
