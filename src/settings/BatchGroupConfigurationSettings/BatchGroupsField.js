import React, { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import {
  KeyValue,
  Select,
} from '@folio/stripes/components';

const BatchGroupsField = ({
  batchGroups,
  setSelectedBatchGroupId,
}) => {
  const batchGroupsOptions = useMemo(() => {
    if (!batchGroups) return [];

    return batchGroups.map(({ name, id }) => ({ label: name, value: id })) || [];
  }, [batchGroups]);

  return batchGroups.length > 1
    ? (
      <Select
        dataOptions={batchGroupsOptions}
        fullWidth
        label={<FormattedMessage id="ui-invoice.settings.batchGroupConfiguration.batchGroup" />}
        onChange={({ target }) => setSelectedBatchGroupId(target.value)}
        required
      />
    )
    : (
      <KeyValue
        label={<FormattedMessage id="ui-invoice.settings.batchGroupConfiguration.batchGroup" />}
        value={batchGroups[0]?.name}
      />
    );
};

BatchGroupsField.propTypes = {
  batchGroups: PropTypes.arrayOf(PropTypes.object),
  setSelectedBatchGroupId: PropTypes.func.isRequired,
};

export default BatchGroupsField;
