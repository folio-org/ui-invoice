import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';

import { LoadingPane } from '@folio/stripes/components';
import { useShowCallout } from '@folio/stripes-acq-components';

import {
  batchGroupsResource,
  batchVoucherExportsResource,
  credentialsResource,
  exportConfigsResource,
  testConnectionResource,
} from '../../common/resources';
import {
  BATCH_VOUCHER_EXPORT_STATUS,
  BATCH_VOUCHER_EXPORTS_API,
  EXPORT_CONFIGURATIONS_API,
} from '../../common/constants';
import {
  RESULT_COUNT_INCREMENT,
  SCHEDULE_EXPORT,
} from './constants';
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
  const [recordsCount, setRecordsCount] = useState(0);
  const [recordsOffset, setRecordsOffset] = useState(0);
  const runningInterval = useRef();

  useEffect(() => {
    return () => clearInterval(runningInterval.current);
  }, []);

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
    (_batchGroupId, offset = 0) => {
      if (!_batchGroupId) return Promise.reject();

      return mutator.batchVoucherExports.GET({
        params: {
          limit: RESULT_COUNT_INCREMENT,
          offset,
          query: `batchGroupId==${_batchGroupId} sortby end/sort.descending start/sort.descending`,
        },
      })
        .then(recordsResponse => {
          if (!offset) setRecordsCount(recordsResponse.totalRecords);
          setBatchVoucherExports((prev) => [
            ...(prev || []),
            ...recordsResponse.batchVoucherExports,
          ]);
        })
        .catch(() => setBatchVoucherExports([]));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const refreshList = useCallback(
    () => {
      setBatchVoucherExports([]);
      setRecordsOffset(0);
      fetchBatchVoucherExports(selectedBatchGroupId, 0);
    },
    [selectedBatchGroupId, fetchBatchVoucherExports],
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
      refreshList();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedBatchGroupId],
  );

  const onNeedMoreData = useCallback(
    () => {
      const newOffset = recordsOffset + RESULT_COUNT_INCREMENT;

      fetchBatchVoucherExports(selectedBatchGroupId, newOffset)
        .then(() => {
          setRecordsOffset(newOffset);
        });
    },
    [selectedBatchGroupId, fetchBatchVoucherExports, recordsOffset],
  );

  const runManualExport = useCallback(
    () => {
      const start = batchVoucherExports[0]?.end ||
        batchGroups.find(({ id }) => id === selectedBatchGroupId)?.metadata.createdDate;

      createManualVoucherExport(mutator.batchVoucherExports, selectedBatchGroupId, start)
        .then(({ id }) => {
          refreshList();

          clearInterval(runningInterval.current);
          runningInterval.current = setInterval(() => {
            mutator.batchVoucherExports.GET({ path: `${BATCH_VOUCHER_EXPORTS_API}/${id}` })
              .then((updated) => {
                const status = updated.status;

                if (status !== BATCH_VOUCHER_EXPORT_STATUS.pending) {
                  clearInterval(runningInterval.current);
                  setBatchVoucherExports(prev => prev.map(d => {
                    return d.id !== id || d.status === status ? d : {
                      ...d,
                      status,
                    };
                  }));
                }
              });
          }, 4000);

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
    [selectedBatchGroupId, batchVoucherExports, batchGroups, showCallout],
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

  const testConnection = useCallback(
    () => {
      mutator.testConnection.POST({})
        .then(() => {
          showCallout({
            messageId: 'ui-invoice.settings.batchGroupConfiguration.testConnection.success',
            type: 'success',
          });
        })
        .catch(async errorResp => {
          let parsedResp;

          try {
            parsedResp = await errorResp.json();
          } catch (parsingException) {
            parsedResp = errorResp;
          }

          showCallout({
            message: (
              <FormattedMessage
                id="ui-invoice.settings.batchGroupConfiguration.testConnection.error"
                values={{ cause: get(parsedResp, 'errors.0.cause') }}
              />
            ),
            timeout: 0,
            type: 'error',
          });
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [showCallout],
  );

  const initialValues = exportConfig?.id
    ? {
      username: credentials?.username,
      password: credentials?.password,
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

  if (isLoading || !exportConfig) {
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
      onNeedMoreData={onNeedMoreData}
      recordsCount={recordsCount}
      testConnection={testConnection}
      hasCredsSaved={Boolean(credentials?.id)}
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
  batchVoucherExports: {
    ...batchVoucherExportsResource,
    records: null,
  },
  testConnection: {
    ...testConnectionResource,
    path: `${EXPORT_CONFIGURATIONS_API}/%{exportConfigId.id}/credentials/test`,
  },
});

BatchGroupConfigurationSettings.propTypes = {
  mutator: PropTypes.object.isRequired,
};

export default BatchGroupConfigurationSettings;
