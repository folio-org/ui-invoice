import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';

import {
  Layer,
  LoadingView,
} from '@folio/stripes/components';
import { TitleManager } from '@folio/stripes/core';
import { useShowCallout } from '@folio/stripes-acq-components';

import {
  useAdjustmentsSetting,
  useAdjustmentsSettingsMutation,
} from '../../hooks';
import { SettingsAdjustmentsForm } from '../SettingsAdjustmentsForm';

export const SettingsAdjustmentsEdit = ({ onClose, refetch }) => {
  const { id } = useParams();
  const intl = useIntl();
  const showCallout = useShowCallout();

  const {
    adjustmentPreset,
    isFetching,
  } = useAdjustmentsSetting(id);

  const { updateSetting } = useAdjustmentsSettingsMutation();

  const onSubmit = async (values) => {
    try {
      await updateSetting({ data: values });
      refetch();
      onClose();
      showCallout({
        messageId: 'ui-invoice.settings.adjustments.update.success',
        values: { name: values.description },
      });
    } catch {
      showCallout({
        type: 'error',
        messageId: 'ui-invoice.settings.adjustments.update.error',
        values: { name: values.description },
      });
    }
  };

  if (isFetching) {
    return (
      <Layer isOpen>
        <LoadingView />
      </Layer>
    );
  }

  const title = adjustmentPreset?.description;

  return (
    <TitleManager
      page={intl.formatMessage({ id: 'ui-invoice.settings.adjustments.label' })}
      record={title}
    >

      <SettingsAdjustmentsForm
        close={onClose}
        initialValues={adjustmentPreset}
        metadata={adjustmentPreset?.metadata}
        onSubmit={onSubmit}
        title={title}
      />
    </TitleManager>
  );
};

SettingsAdjustmentsEdit.propTypes = {
  onClose: PropTypes.func.isRequired,
  refetch: PropTypes.func.isRequired,
};
