import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import {
  FieldSelectionFinal,
  validateRequired,
} from '@folio/stripes-acq-components';

import { getBatchGroupsOptions } from '../../../common/utils';

const FieldBatchGroup = ({ batchGroups, isEditPostApproval }) => {
  const batchGroupsOptions = useMemo(() => {
    return getBatchGroupsOptions(batchGroups);
  }, [batchGroups]);

  const labelId = 'ui-invoice.invoice.details.information.batchGroup';
  const isDisabled = isEditPostApproval || batchGroups.length === 1;

  return (
    <FieldSelectionFinal
      dataOptions={batchGroupsOptions}
      disabled={isDisabled}
      id="invoice-batch-groups"
      labelId={labelId}
      name="batchGroupId"
      required
      validate={validateRequired}
    />
  );
};

FieldBatchGroup.propTypes = {
  batchGroups: PropTypes.arrayOf(PropTypes.object),
  isEditPostApproval: PropTypes.bool,
};

FieldBatchGroup.defaultProps = {
  isEditPostApproval: false,
};

export default FieldBatchGroup;
