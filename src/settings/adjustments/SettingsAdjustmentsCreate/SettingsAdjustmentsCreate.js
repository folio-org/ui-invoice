import PropTypes from 'prop-types';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';

import { TitleManager } from '@folio/stripes/core';
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
  const intl = useIntl();
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

  const title = <FormattedMessage id="ui-invoice.settings.adjustments.title.new" />;

  return (
    <TitleManager
      page={intl.formatMessage({ id: 'ui-invoice.settings.adjustments.label' })}
      record={title}
    >
      <SettingsAdjustmentsForm
        close={onClose}
        initialValues={INITIAL_VALUES}
        onSubmit={onSubmit}
        title={title}
      />
    </TitleManager>
  );
};

SettingsAdjustmentsCreate.propTypes = {
  onClose: PropTypes.func.isRequired,
  refetch: PropTypes.func.isRequired,
};
