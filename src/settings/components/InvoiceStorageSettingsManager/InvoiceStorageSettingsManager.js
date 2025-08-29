import get from 'lodash/get';
import PropTypes from 'prop-types';
import {
  useCallback,
  useMemo,
} from 'react';

import { Loading } from '@folio/stripes/components';
import { ConfigFinalForm } from '@folio/stripes/smart-components';
import { useShowCallout } from '@folio/stripes-acq-components';

import { useInvoiceStorageSettings } from '../../../common/hooks';
import { useInvoiceStorageSettingsMutation } from '../../hooks';

export const InvoiceStorageSettingsManager = ({
  children,
  configName,
  getInitialValues,
  label,
  onBeforeSave,
}) => {
  const showCallout = useShowCallout();

  const {
    isFetching,
    settings,
    refetch,
  } = useInvoiceStorageSettings({ key: configName });

  const {
    isLoading: isMutating,
    upsertSetting,
  } = useInvoiceStorageSettingsMutation();

  const initialValues = useMemo(() => {
    return typeof getInitialValues === 'function'
      ? getInitialValues(settings)
      : { [configName]: settings[0]?.value };
  }, [configName, getInitialValues, settings]);

  const onSubmit = useCallback(async (values) => {
    const value = typeof onBeforeSave === 'function' ? onBeforeSave(values) : get(values, configName);

    const data = {
      ...(settings[0] || { key: configName }),
      value,
    };

    await upsertSetting({ data })
      .then(() => {
        refetch();
        showCallout({ messageId: 'stripes-smart-components.cm.success' });
      })
      .catch(() => {
        showCallout({
          messageId: 'ui-orders.settings.update.error',
          type: 'error',
        });
      });
  }, [configName, upsertSetting, onBeforeSave, refetch, settings, showCallout]);

  const isLoading = isFetching || isMutating;

  return (
    <ConfigFinalForm
      onSubmit={onSubmit}
      initialValues={initialValues}
      label={label}
    >
      {isLoading ? <Loading /> : children}
    </ConfigFinalForm>
  );
};

InvoiceStorageSettingsManager.propTypes = {
  configName: PropTypes.string.isRequired,
  getInitialValues: PropTypes.func,
  label: PropTypes.node.isRequired,
  onBeforeSave: PropTypes.func,
  children: PropTypes.node,
};
