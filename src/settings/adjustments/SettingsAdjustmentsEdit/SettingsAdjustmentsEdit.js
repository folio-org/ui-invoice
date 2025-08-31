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
import { getSettingsAdjustmentsList } from '../util';

export const SettingsAdjustmentsEdit = ({ onClose, refetch }) => {
  const { id } = useParams();
  const intl = useIntl();
  const showCallout = useShowCallout();

  const {
    isFetching,
    setting,
  } = useAdjustmentsSetting(id);

  const { upsertSetting } = useAdjustmentsSettingsMutation();

  /* Get formatted adjustment for the form */
  const adjustment = useMemo(() => {
    return getSettingsAdjustmentsList([setting])[0];
  }, [setting]);

  const onSubmit = async (values) => {
    const value = JSON.stringify(values);

    const data = {
      ...setting,
      value,
    };

    try {
      await upsertSetting({ data });
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

  const title = adjustment?.adjustment?.description;

  return (
    <TitleManager
      page={intl.formatMessage({ id: 'ui-invoice.settings.adjustments.label' })}
      record={title}
    >

      <SettingsAdjustmentsForm
        close={onClose}
        initialValues={adjustment?.adjustment}
        metadata={adjustment?.adjustment?.metadata}
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
