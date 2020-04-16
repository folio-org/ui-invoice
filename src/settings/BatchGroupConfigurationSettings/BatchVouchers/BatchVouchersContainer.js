import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import { stripesConnect } from '@folio/stripes/core';

import { batchVouchersFromPropResource } from '../../../common/resources';
import BatchVouchers from './BatchVouchers';

const BatchVouchersContainer = ({ mutator, batchVoucherId }) => {
  const downloadBatchVouchers = useCallback(
    () => {
      mutator.batchVouchers.GET();
      // then download file
    },
    [mutator.batchVouchers],
  );

  return (
    <BatchVouchers
      downloadBatchVouchers={batchVoucherId ? downloadBatchVouchers : undefined}
    />
  );
};

BatchVouchersContainer.manifest = Object.freeze({
  batchVouchers: batchVouchersFromPropResource,
});

BatchVouchersContainer.propTypes = {
  mutator: PropTypes.object.isRequired,
  batchVoucherId: PropTypes.string,
};

BatchVouchersContainer.defaultProps = {
  batchVoucherId: '',
};

export default stripesConnect(BatchVouchersContainer);
