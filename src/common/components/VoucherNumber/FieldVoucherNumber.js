import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';

import { TextField } from '@folio/stripes/components';

import VoucherNumberValue from './VoucherNumberValue';

const FieldVoucherNumber = ({ isNonInteractive, value, name, id }) => (
  isNonInteractive
    ? <VoucherNumberValue value={value} />
    : (
      <Field
        component={TextField}
        labelId="ui-invoice.invoice.details.voucher.voucherNumber"
        id={id}
        name={name}
        type="text"
      />
    )
);

FieldVoucherNumber.propTypes = {
  id: PropTypes.string.isRequired,
  isNonInteractive: PropTypes.bool,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

FieldVoucherNumber.defaultProps = {
  isNonInteractive: false,
};

export default FieldVoucherNumber;
