import get from 'lodash/get';
import PropTypes from 'prop-types';
import { useContext } from 'react';
import { Field, useFormState } from 'react-final-form';

import { KeyValue } from '@folio/stripes/components';
import { TextField } from '@folio/stripes-acq-components';

import { CredentialsContext } from '../CredentialsContext';

const CHAR_REPLACER = '•';

export const CredentialsField = ({
  isNonInteractive,
  name,
  ...props
}) => {
  const { values } = useFormState();
  const { isCredsVisible } = useContext(CredentialsContext);

  if (isNonInteractive) {
    return (
      <KeyValue {...props}>
        {isCredsVisible ? get(values, name) : CHAR_REPLACER.repeat(8)}
      </KeyValue>
    );
  }

  return (
    <Field
      data-testid="credentials-field"
      component={TextField}
      type={isCredsVisible ? 'text' : 'password'}
      fullWidth
      name={name}
      {...props}
    />
  );
};

CredentialsField.propTypes = {
  disabled: PropTypes.bool,
  isNonInteractive: PropTypes.bool,
  name: PropTypes.string.isRequired,
};
