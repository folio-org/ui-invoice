import React, { useCallback, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import {
  KeyValue,
  Select,
} from '@folio/stripes/components';

import { getBatchGroupsOptions } from '../../common/utils';

const BatchGroupsField = ({
  batchGroups,
  selectBatchGroup,
  selectedBatchGroupId,
}) => {
  const batchGroupsOptions = useMemo(() => {
    return getBatchGroupsOptions(batchGroups);
  }, [batchGroups]);

  const onChange = useCallback(
    ({ target }) => {
      selectBatchGroup(target.value);
    },
    [selectBatchGroup],
  );

  return batchGroups.length > 1
    ? (
      <Select
        data-test-batch-group-select
        dataOptions={batchGroupsOptions}
        fullWidth
        label={<FormattedMessage id="ui-invoice.settings.batchGroupConfiguration.batchGroup" />}
        onChange={onChange}
        required
        value={selectedBatchGroupId}
      />
    )
    : (
      <KeyValue
        data-test-batch-group-value
        label={<FormattedMessage id="ui-invoice.settings.batchGroupConfiguration.batchGroup" />}
        value={batchGroups[0]?.name}
      />
    );
};

BatchGroupsField.propTypes = {
  batchGroups: PropTypes.arrayOf(PropTypes.object),
  selectBatchGroup: PropTypes.func.isRequired,
  selectedBatchGroupId: PropTypes.string,
};

export default BatchGroupsField;
