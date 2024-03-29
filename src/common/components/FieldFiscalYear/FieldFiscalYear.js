import PropTypes from 'prop-types';

import { FieldSelectionFinal } from '@folio/stripes-acq-components';

export const FieldFiscalYear = ({
  id,
  disabled,
  name,
  dataOptions,
  required,
}) => {
  return (
    <FieldSelectionFinal
      dataOptions={dataOptions}
      disabled={disabled}
      id={id}
      labelId="ui-invoice.invoice.details.information.fiscalYear"
      name={name}
      required={required}
    />
  );
};

FieldFiscalYear.propTypes = {
  dataOptions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  })),
  disabled: PropTypes.bool,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  required: PropTypes.bool,
};
