import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { KeyValue } from '@folio/stripes/components';

export const FiscalYearValue = ({ value }) => {
  return (
    <KeyValue
      label={<FormattedMessage id="ui-invoice.invoice.details.information.fiscalYear" />}
      value={value}
    />
  );
};

FiscalYearValue.propTypes = {
  value: PropTypes.string,
};
