import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { useShowCallout } from '@folio/stripes-acq-components';

import {
  ADJUSTMENT_PRORATE_VALUES,
  ADJUSTMENT_RELATION_TO_TOTAL_VALUES,
  ADJUSTMENT_TYPE_VALUES,
  CONFIG_NAME_ADJUSTMENTS,
} from '../../../common/constants';
import { useAdjustmentsSettingsMutation } from '../../hooks';
import { SettingsAdjustmentsForm } from '../SettingsAdjustmentsForm';

const INITIAL_VALUES = {
  alwaysShow: true,
  exportToAccounting: false,
  prorate: ADJUSTMENT_PRORATE_VALUES.notProrated,
  relationToTotal: ADJUSTMENT_RELATION_TO_TOTAL_VALUES.inAdditionTo,
  type: ADJUSTMENT_TYPE_VALUES.amount,
};

export const SettingsAdjustmentsCreate = ({ onClose, refetch }) => {
  const showCallout = useShowCallout();

  const { upsertSetting } = useAdjustmentsSettingsMutation();

  const onSubmit = async (values) => {
    const value = JSON.stringify(values);

    const data = {
      key: CONFIG_NAME_ADJUSTMENTS,
      value,
    };

    try {
      await upsertSetting({ data });
      refetch();
      onClose();
      showCallout({
        messageId: 'ui-invoice.settings.adjustments.create.success',
        values: { name: values.description },
      });
    } catch (error) {
      showCallout({
        type: 'error',
        messageId: 'ui-invoice.settings.adjustments.create.error',
      });
    }
  };

  return (
    <SettingsAdjustmentsForm
      close={onClose}
      initialValues={INITIAL_VALUES}
      onSubmit={onSubmit}
      title={<FormattedMessage id="ui-invoice.settings.adjustments.title.new" />}
    />
  );
};

SettingsAdjustmentsCreate.propTypes = {
  onClose: PropTypes.func.isRequired,
  refetch: PropTypes.func.isRequired,
};
