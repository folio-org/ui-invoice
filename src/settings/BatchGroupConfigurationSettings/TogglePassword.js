import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field, useFormState } from 'react-final-form';

import {
  Button,
  Col,
  KeyValue,
  TextField,
} from '@folio/stripes/components';
import { useToggle } from '@folio/stripes-acq-components';

const CHAR_REPLACER = '•';
const FIELD_LABEL = <FormattedMessage id="ui-invoice.settings.batchGroupConfiguration.password" />;

const TogglePassword = ({ name, isNonInteractive = false }) => {
  const [showPassword, togglePassword] = useToggle(false);
  const { values } = useFormState();

  return (
    <>
      <Col xs={4}>
        {
          isNonInteractive
            ? (
              <KeyValue
                label={FIELD_LABEL}
                value={showPassword ? values[name] : values[name]?.replaceAll(/./g, CHAR_REPLACER)}
              />
            )
            : (
              <Field
                autoComplete="new-password"
                component={TextField}
                fullWidth
                id={name}
                label={FIELD_LABEL}
                name={name}
                type={showPassword ? 'text' : 'password'}
              />
            )
        }
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
  isNonInteractive: PropTypes.bool,
  name: PropTypes.string.isRequired,
};

export default TogglePassword;
