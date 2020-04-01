import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';
import PropTypes from 'prop-types';

import { LoadingPane } from '@folio/stripes/components';
import {
  useShowCallout,
} from '@folio/stripes-acq-components';

import {
  batchGroupsResource,
  batchVoucherExportsResource,
  credentialsResource,
  exportConfigsResource,
} from '../../common/resources';
import { EXPORT_CONFIGURATIONS_API } from '../../common/constants';
import { SCHEDULE_EXPORT } from './constants';
import {
  createManualVoucherExport,
  saveExportConfig,
} from './utils';
import BatchGroupConfigurationForm from './BatchGroupConfigurationForm';

const BatchGroupConfigurationSettings = ({ mutator }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [batchGroups, setBatchGroups] = useState();
  const [selectedBatchGroupId, setSelectedBatchGroupId] = useState();
  const [exportConfig, setExportConfig] = useState();
  const [credentials, setCredentials] = useState();
  const [batchVoucherExports, setBatchVoucherExports] = useState();
  const showCallout = useShowCallout();

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

  const fetchBatchVoucherExports = useCallback(
    (id) => {
      if (id) {
        setBatchVoucherExports();

        mutator.batchVoucherExports.GET({
          params: {
            query: `batchGroupId==${id} sortby end/sort.descending start/sort.descending`,
          },
        })
          .then(setBatchVoucherExports)
          .catch(() => setBatchVoucherExports([]));
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedBatchGroupId],
  );

  const fetchExportConfig = useCallback(
    (id) => {
      if (id) {
        setExportConfig();
        setCredentials();

        mutator.exportConfig.GET({
          params: {
            query: `batchGroupId==${id}`,
          },
        })
          .then(([config = {}]) => {
            const exportConfigId = config.id;

            setExportConfig(config);
            mutator.exportConfigId.update({ id: exportConfigId });

            return exportConfigId
              ? mutator.credentials.GET()
              : {};
          })
          .then(setCredentials);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedBatchGroupId],
  );

  useEffect(
    () => {
      fetchExportConfig(selectedBatchGroupId);
      fetchBatchVoucherExports(selectedBatchGroupId);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedBatchGroupId],
  );

  const runManualExport = useCallback(
    () => {
      const batchGroupCreatedDate = batchGroups.find(({ id }) => id === selectedBatchGroupId).metadata.createdDate;
      const start = batchVoucherExports[0]?.end || batchGroupCreatedDate;

      createManualVoucherExport(mutator.batchVoucherExports, selectedBatchGroupId, start)
        .then(() => {
          fetchBatchVoucherExports(selectedBatchGroupId);
          showCallout({
            messageId: 'ui-invoice.settings.runManualExport.success',
            type: 'success',
          });
        })
        .catch(() => showCallout({
          messageId: 'ui-invoice.settings.runManualExport.error',
          type: 'error',
        }));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedBatchGroupId, batchVoucherExports, batchGroups],
  );

  const onSave = useCallback(
    (formValues) => {
      saveExportConfig(formValues, mutator, credentials)
        .then(() => {
          fetchExportConfig(selectedBatchGroupId);
          showCallout({
            messageId: 'ui-invoice.settings.batchGroupConfiguration.save.success',
            type: 'success',
          });
        })
        .catch(() => showCallout({
          messageId: 'ui-invoice.settings.batchGroupConfiguration.save.error',
          type: 'error',
        }));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedBatchGroupId, credentials],
  );

  const initialValues = exportConfig?.id
    ? {
      ...credentials,
      ...exportConfig,
      batchGroupId: selectedBatchGroupId,
      scheduleExport: exportConfig?.enableScheduledExport
        ? exportConfig?.weekdays?.length ? SCHEDULE_EXPORT.weekly : SCHEDULE_EXPORT.daily
        : '',
      weekdays: exportConfig?.weekdays?.length
        ? exportConfig.weekdays.reduce((acc, i) => ({ ...acc, [i]: true }), {})
        : {},
    }
    : { batchGroupId: selectedBatchGroupId };

  if (isLoading) {
    return (
      <LoadingPane defaultWidth="fill" />
    );
  }

  return (
    <BatchGroupConfigurationForm
      batchGroups={batchGroups}
      batchVoucherExports={batchVoucherExports}
      initialValues={initialValues}
      onSubmit={onSave}
      selectedBatchGroupId={selectedBatchGroupId}
      selectBatchGroup={setSelectedBatchGroupId}
      runManualExport={runManualExport}
    />
  );
};

BatchGroupConfigurationSettings.manifest = Object.freeze({
  batchGroups: batchGroupsResource,
  exportConfig: exportConfigsResource,
  credentials: {
    ...credentialsResource,
    path: `${EXPORT_CONFIGURATIONS_API}/%{exportConfigId.id}/credentials`,
  },
  exportConfigId: {},
  batchVoucherExports: batchVoucherExportsResource,
});

BatchGroupConfigurationSettings.propTypes = {
  mutator: PropTypes.object.isRequired,
};

export default BatchGroupConfigurationSettings;
