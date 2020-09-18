import React from 'react';
import PropTypes from 'prop-types';

import { useCurrencyOptions } from '@folio/stripes/components';

import {
  FieldSelectionFinal,
  validateRequired,
} from '@folio/stripes-acq-components';

import CurrencyValue from './CurrencyValue';

const FieldCurrency = ({ isNonInteractive, value, name, required, id, onChange }) => {
  const currenciesOptions = useCurrencyOptions();

  return (
    isNonInteractive
      ? <CurrencyValue value={value} />
      : (
        <FieldSelectionFinal
          dataOptions={currenciesOptions}
          id={id}
          labelId="ui-invoice.invoice.currency"
          name={name}
          onChange={onChange}
          required={required}
          validate={required ? validateRequired : undefined}
        />
      )
  );
};

FieldCurrency.propTypes = {
  id: PropTypes.string.isRequired,
  isNonInteractive: PropTypes.bool,
  name: PropTypes.string.isRequired,
  required: PropTypes.bool,
  value: PropTypes.string,
  onChange: PropTypes.func,
};

FieldCurrency.defaultProps = {
  isNonInteractive: false,
  required: false,
};

export default FieldCurrency;
