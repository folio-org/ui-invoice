import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';

import {
  Button,
  Col,
  TextField,
} from '@folio/stripes/components';
import { useToggle } from '@folio/stripes-acq-components';

const TogglePassword = ({ name }) => {
  const [showPassword, togglePassword] = useToggle(false);

  return (
    <>
      <Col xs={4}>
        <Field
          autoComplete="new-password"
          component={TextField}
          fullWidth
          id={name}
          label={<FormattedMessage id="ui-invoice.settings.batchGroupConfiguration.password" />}
          name={name}
          type={showPassword ? 'text' : 'password'}
        />
      </Col>
      <Col xs={2}>
        <Button
          data-test-toggle-password-button
          onClick={togglePassword}
          style={{ marginBottom: '15px' }}
        >
          {
            showPassword
              ? <FormattedMessage id="ui-invoice.settings.batchGroupConfiguration.password.hide" />
              : <FormattedMessage id="ui-invoice.settings.batchGroupConfiguration.password.show" />
          }
        </Button>
      </Col>
    </>
  );
};

TogglePassword.propTypes = {
  name: PropTypes.string.isRequired,
};

export default TogglePassword;
