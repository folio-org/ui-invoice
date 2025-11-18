import PropTypes from 'prop-types';
import { useMemo } from 'react';

import {
  FieldSelectionFinal,
  validateRequired,
} from '@folio/stripes-acq-components';

import { getBatchGroupsOptions } from '../../../common/utils';

const FieldBatchGroup = ({
  batchGroups,
  isNonInteractive = false,
}) => {
  const batchGroupsOptions = useMemo(() => {
    return getBatchGroupsOptions(batchGroups);
  }, [batchGroups]);

  return (
    <FieldSelectionFinal
      dataOptions={batchGroupsOptions}
      id="invoice-batch-groups"
      labelId="ui-invoice.invoice.details.information.batchGroup"
      name="batchGroupId"
      required
      validate={validateRequired}
      isNonInteractive={isNonInteractive || batchGroups.length === 1}
    />
  );
};

FieldBatchGroup.propTypes = {
  batchGroups: PropTypes.arrayOf(PropTypes.object),
  isNonInteractive: PropTypes.bool,
};

export default FieldBatchGroup;
