import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';

import { TextField } from '@folio/stripes/components';

import PaymentTermsValue from './PaymentTermsValue';

const FieldPaymentTerms = ({ isNonInteractive, value, name, id }) => (
  isNonInteractive
    ? <PaymentTermsValue value={value} />
    : (
      <Field
        component={TextField}
        label={<FormattedMessage id="ui-invoice.invoice.paymentTerms" />}
        id={id}
        name={name}
        type="text"
      />
    )
);

FieldPaymentTerms.propTypes = {
  id: PropTypes.string.isRequired,
  isNonInteractive: PropTypes.bool,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
};

FieldPaymentTerms.defaultProps = {
  isNonInteractive: false,
};

export default FieldPaymentTerms;
