import get from 'lodash/get';
import PropTypes from 'prop-types';
import {
  useCallback,
  useEffect,
  useState,
} from 'react';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';

import { LoadingPane } from '@folio/stripes/components';
import { TitleManager } from '@folio/stripes/core';
import {
  LIMIT_MAX,
  useShowCallout,
} from '@folio/stripes-acq-components';

import {
  credentialsResource,
  exportConfigsResource,
  testConnectionResource,
} from '../../common/resources';
import { EXPORT_CONFIGURATIONS_API } from '../../common/constants';
import { useBatchGroups } from '../../common/hooks';
import BatchGroupConfigurationForm from './BatchGroupConfigurationForm';
import { SCHEDULE_EXPORT } from './constants';
import { saveExportConfig } from './utils';

const BatchGroupConfigurationSettings = ({ mutator }) => {
  const intl = useIntl();
  const showCallout = useShowCallout();

  const [selectedBatchGroupId, setSelectedBatchGroupId] = useState();
  const [exportConfig, setExportConfig] = useState();
  const [credentials, setCredentials] = useState();

  const { batchGroups, isLoading } = useBatchGroups();

  useEffect(() => {
    setSelectedBatchGroupId(batchGroups[0]?.id);
  }, [batchGroups]);

  const fetchExportConfig = useCallback(
    (id) => {
      if (id) {
        setExportConfig();
        setCredentials();

        mutator.exportConfig.GET({
          params: {
            limit: `${LIMIT_MAX}`,
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
          .then(setCredentials)
          .catch(() => setCredentials({}));
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedBatchGroupId],
  );

  useEffect(
    () => {
      fetchExportConfig(selectedBatchGroupId);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedBatchGroupId],
  );

  const onSave = useCallback(
    (formValues) => {
      return saveExportConfig(formValues, mutator, credentials)
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
    [credentials, fetchExportConfig, selectedBatchGroupId, showCallout],
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
    <TitleManager record={intl.formatMessage({ id: 'ui-invoice.settings.batchGroupConfiguration.label' })}>
      <BatchGroupConfigurationForm
        batchGroups={batchGroups}
        initialValues={initialValues}
        onSubmit={onSave}
        selectedBatchGroupId={selectedBatchGroupId}
        selectBatchGroup={setSelectedBatchGroupId}
        testConnection={testConnection}
        hasCredsSaved={Boolean(credentials?.id)}
      />
    </TitleManager>
  );
};

BatchGroupConfigurationSettings.manifest = Object.freeze({
  exportConfig: exportConfigsResource,
  credentials: {
    ...credentialsResource,
    path: `${EXPORT_CONFIGURATIONS_API}/%{exportConfigId.id}/credentials`,
  },
  exportConfigId: {},
  testConnection: {
    ...testConnectionResource,
    path: `${EXPORT_CONFIGURATIONS_API}/%{exportConfigId.id}/credentials/test`,
  },
});

BatchGroupConfigurationSettings.propTypes = {
  mutator: PropTypes.object.isRequired,
};

export default BatchGroupConfigurationSettings;
