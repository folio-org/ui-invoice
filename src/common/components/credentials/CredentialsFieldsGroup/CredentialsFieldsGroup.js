import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';

import { CredentialsContext } from '../CredentialsContext';

export const CredentialsFieldsGroup = ({ children }) => {
  const [isCredsVisible, setIsCredsVisible] = useState(false);
  const toggleCreds = useMemo(() => () => setIsCredsVisible(prev => !prev), []);

  const contextValue = useMemo(() => ({
    isCredsVisible,
    toggleCreds,
  }), [isCredsVisible, toggleCreds]);

  return (
    <CredentialsContext.Provider value={contextValue}>
      {typeof children === 'function' ? children(contextValue) : children}
    </CredentialsContext.Provider>
  );
};

CredentialsFieldsGroup.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.func,
  ]),
};
