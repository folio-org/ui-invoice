import React, { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

import { TextField } from '@folio/stripes/components';
import {
  FieldSelection,
  validateRequired,
} from '@folio/stripes-acq-components';

import { getBatchGroupsOptions } from '../../../common/utils';

const FieldBatchGroup = ({ batchGroups, isEditPostApproval }) => {
  const batchGroupsOptions = useMemo(() => {
    return getBatchGroupsOptions(batchGroups);
  }, [batchGroups]);

  const labelId = 'ui-invoice.invoice.details.information.batchGroup';

  return batchGroups.length > 1
    ? (
      <FieldSelection
        dataOptions={batchGroupsOptions}
        disabled={isEditPostApproval}
        id="invoice-batch-groups"
        labelId={labelId}
        name="batchGroupId"
        required
        validate={validateRequired}
      />
    )
    : (
      <Field
        component={TextField}
        disabled
        format={() => batchGroups[0]?.name}
        id="invoice-batch-group"
        label={<FormattedMessage id={labelId} />}
        name="batchGroupId"
        type="text"
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
