import React from 'react';
import PropTypes from 'prop-types';

import { IconButton } from '@folio/stripes/components';

const BatchVouchers = ({ downloadBatchVouchers }) => (
  downloadBatchVouchers
    ? (
      <IconButton
        data-test-batch-voucher-export-download
        icon="download"
        onClick={downloadBatchVouchers}
      />
    )
    : null
);

BatchVouchers.propTypes = {
  downloadBatchVouchers: PropTypes.func,
};

export default BatchVouchers;
