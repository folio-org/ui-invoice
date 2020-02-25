import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';
import PropTypes from 'prop-types';

import { LoadingPane } from '@folio/stripes/components';

import { batchGroupsResource } from '../../common/resources';
import BatchGroupConfigurationForm from './BatchGroupCongiurationForm';

const BatchGroupConfigurationSettings = ({ mutator }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [batchGroups, setBatchGroups] = useState();
  const [selectedBatchGroupId, setSelectedBatchGroupId] = useState();

  useEffect(() => {
    setIsLoading(true);

    mutator.batchGroups.GET()
      .then((batchGroupsResp) => {
        const batchGroupIdResp = batchGroupsResp[0]?.id;

        setBatchGroups(batchGroupsResp);
        setSelectedBatchGroupId(batchGroupIdResp);
      })
      .catch(() => setBatchGroups([]))
      .finally(() => setIsLoading(false));
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  []);

  const onSaveExportConfig = useCallback(
    () => {

    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedBatchGroupId],
  );

  if (isLoading) {
    return (
      <LoadingPane defaultWidth="fill" />
    );
  }

  return (
    <BatchGroupConfigurationForm
      batchGroups={batchGroups}
      onSubmit={onSaveExportConfig}
      setSelectedBatchGroupId={setSelectedBatchGroupId}
    />
  );
};

BatchGroupConfigurationSettings.manifest = Object.freeze({
  batchGroups: batchGroupsResource,
});

BatchGroupConfigurationSettings.propTypes = {
  mutator: PropTypes.object.isRequired,
};

export default BatchGroupConfigurationSettings;
