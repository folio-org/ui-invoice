import React from 'react';
import PropTypes from 'prop-types';

import {
  Icon,
  Pane,
} from '@folio/stripes/components';

const LoadingPane = ({ onClose }) => {
  return (
    <Pane
      id="pane-loading"
      defaultWidth="fill"
      dismissible
      onClose={onClose}
    >
      <div>
        <Icon
          icon="spinner-ellipsis"
          width="100px"
        />
      </div>
    </Pane>
  );
};

LoadingPane.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default LoadingPane;
