import React from 'react';
import PropTypes from 'prop-types';

import {
  FieldSelectionFinal,
  validateRequired,
} from '@folio/stripes-acq-components';

import StatusValue from './StatusValue';

const FieldStatus = ({ isNonInteractive, value, name, required, statusOptions, id }) => (
  isNonInteractive
    ? <StatusValue value={value} />
    : (
      <FieldSelectionFinal
        dataOptions={statusOptions}
        id={id}
        labelId="ui-invoice.invoice.details.information.status"
        name={name}
        required={required}
        validate={required ? validateRequired : undefined}
      />
    )
);

FieldStatus.propTypes = {
  id: PropTypes.string.isRequired,
  isNonInteractive: PropTypes.bool,
  name: PropTypes.string.isRequired,
  required: PropTypes.bool,
  statusOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
  value: PropTypes.string,
};

FieldStatus.defaultProps = {
  isNonInteractive: false,
  required: false,
};

export default FieldStatus;
