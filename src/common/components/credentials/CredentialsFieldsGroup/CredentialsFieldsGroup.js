import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';

import { CredentialsContext } from '../CredentialsContext';

export const CredentialsFieldsGroup = ({ children }) => {
  const [isCredsVisible, setCredsVisible] = useState(false);
  const toggleCreds = useMemo(() => () => setCredsVisible(prev => !prev), []);

  const contextValue = {
    isCredsVisible,
    toggleCreds,
  };

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
