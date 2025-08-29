import get from 'lodash/get';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import ReactRouterPropTypes from 'react-router-prop-types';

import {
  ADJUSTMENT_PRORATE_VALUES,
  ADJUSTMENT_RELATION_TO_TOTAL_VALUES,
  ADJUSTMENT_TYPE_VALUES,
  CONFIG_NAME_ADJUSTMENTS,
} from '../../../common/constants';
import {
  useInvoiceStorageSettings,
  useInvoiceStorageSettingsMutation,
} from '../../../common/hooks';
import { getSettingsAdjustmentsList } from '../util';
import SettingsAdjustmentsEditor from './SettingsAdjustmentsEditor';

const INITIAL_VALUES = {
  alwaysShow: true,
  exportToAccounting: false,
  prorate: ADJUSTMENT_PRORATE_VALUES.notProrated,
  relationToTotal: ADJUSTMENT_RELATION_TO_TOTAL_VALUES.inAdditionTo,
  type: ADJUSTMENT_TYPE_VALUES.amount,
};

const SettingsAdjustmentsEditorContainer = ({ close, match }) => {
  const id = match?.params?.id;

  const { settings } = useInvoiceStorageSettings({ key: CONFIG_NAME_ADJUSTMENTS });

  const { upsertSetting } = useInvoiceStorageSettingsMutation();

  const adjustments = getSettingsAdjustmentsList(settings);
  const adjustment = useMemo(() => (id ? get(adjustments, '0', {}) : INITIAL_VALUES), [id, adjustments]);
  const initialValues = useMemo(() => (adjustment.adjustment || INITIAL_VALUES), [adjustment]);

  const saveAdjustment = (values) => {
    const value = JSON.stringify(values);

    const data = {
      ...(settings[0] || { key: CONFIG_NAME_ADJUSTMENTS }),
      value,
    };

    upsertSetting({ data }).then(close);
  };

  return (
    <SettingsAdjustmentsEditor
      title={adjustment?.adjustment?.description || <FormattedMessage id="ui-invoice.settings.adjustments.title.new" />}
      onSubmit={saveAdjustment}
      close={close}
      initialValues={initialValues}
      metadata={adjustment.metadata}
    />
  );
};

SettingsAdjustmentsEditorContainer.propTypes = {
  close: PropTypes.func.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
};

export default SettingsAdjustmentsEditorContainer;
