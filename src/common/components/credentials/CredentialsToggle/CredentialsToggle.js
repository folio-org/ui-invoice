import PropTypes from 'prop-types';
import { useContext } from 'react';
import { FormattedMessage } from 'react-intl';

import { Button } from '@folio/stripes/components';

import { CredentialsContext } from '../CredentialsContext';

import css from './CredentialsToggle.css';

export const CredentialsToggle = ({ label, ...props }) => {
  const { isCredsVisible, toggleCreds } = useContext(CredentialsContext);

  return (
    <div className={css.toggle}>
      <Button
        onClick={toggleCreds}
        {...props}
      >
        {label ?? <FormattedMessage id={`ui-invoice.settings.batchGroupConfiguration.password.${isCredsVisible ? 'hide' : 'show'}`} />}
      </Button>
    </div>
  );
}

CredentialsToggle.propTypes = {
  label: PropTypes.node,
};
