import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { KeyValue } from '@folio/stripes/components';
import { VersionKeyValue } from '@folio/stripes-acq-components';

export const FiscalYearValue = ({ isVersionView, name, value }) => {
  const KeyValueComponent = isVersionView ? VersionKeyValue : KeyValue;

  return (
    <KeyValueComponent
      name={name}
      label={<FormattedMessage id="ui-invoice.invoice.details.information.fiscalYear" />}
      value={value}
    />
  );
};

FiscalYearValue.propTypes = {
  isVersionView: PropTypes.bool,
  name: PropTypes.string,
  value: PropTypes.string,
};
