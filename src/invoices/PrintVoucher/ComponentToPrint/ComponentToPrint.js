import React from 'react';
import PropTypes from 'prop-types';

const ComponentToPrint = ({ dataSource = {} }) => {
  return 'Voucher and lines';
};

ComponentToPrint.propTypes = {
  dataSource: PropTypes.object,
};

export default ComponentToPrint;
