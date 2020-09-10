import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import {
  FieldSelectionFinal,
  validateRequired,
} from '@folio/stripes-acq-components';

import { getBatchGroupsOptions } from '../../../common/utils';
import BatchGroupValue from '../../InvoiceDetails/BatchGroupValue';

const FieldBatchGroup = ({ batchGroups, isNonIteractive, batchGroupId }) => {
  const batchGroupsOptions = useMemo(() => {
    return getBatchGroupsOptions(batchGroups);
  }, [batchGroups]);

  const labelId = 'ui-invoice.invoice.details.information.batchGroup';

  return (
    isNonIteractive || batchGroups.length === 1
      ? (
        <BatchGroupValue
          id={batchGroupId}
          label={labelId}
        />
      )
      : (
        <FieldSelectionFinal
          dataOptions={batchGroupsOptions}
          id="invoice-batch-groups"
          labelId={labelId}
          name="batchGroupId"
          required
          validate={validateRequired}
        />
      )
  );
};

FieldBatchGroup.propTypes = {
  batchGroupId: PropTypes.string,
  batchGroups: PropTypes.arrayOf(PropTypes.object),
  isNonIteractive: PropTypes.bool,
};

FieldBatchGroup.defaultProps = {
  isNonIteractive: false,
};

export default FieldBatchGroup;
