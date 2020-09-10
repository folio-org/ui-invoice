import React from 'react';
import PropTypes from 'prop-types';

import {
  FieldDatepickerFinal,
  validateRequired,
} from '@folio/stripes-acq-components';

import InvoiceDateValue from './InvoiceDateValue';

const FieldInvoiceDate = ({ isNonInteractive, value, name, required }) => (
  isNonInteractive
    ? <InvoiceDateValue value={value} />
    : (
      <FieldDatepickerFinal
        labelId="ui-invoice.invoice.details.information.invoiceDate"
        name={name}
        required={required}
        validate={required ? validateRequired : undefined}
      />
    )
);

FieldInvoiceDate.propTypes = {
  isNonInteractive: PropTypes.bool,
  name: PropTypes.string.isRequired,
  required: PropTypes.bool,
  value: PropTypes.string,
};

FieldInvoiceDate.defaultProps = {
  isNonInteractive: false,
  required: false,
};

export default FieldInvoiceDate;
