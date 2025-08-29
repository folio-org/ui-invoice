import PropTypes from 'prop-types';
import {
  useCallback,
  useMemo,
} from 'react';
import { FormattedMessage } from 'react-intl';
import ReactRouterPropTypes from 'react-router-prop-types';

import { useStripes } from '@folio/stripes/core';
import { useShowCallout } from '@folio/stripes-acq-components';

import {
  useInvoiceStorageSettingById,
  useInvoiceStorageSettingsMutation,
} from '../../../common/hooks';
import { getSettingsAdjustmentsList } from '../util';
import SettingsAdjustmentsView from './SettingsAdjustmentsView';

function SettingsAdjustmentsViewContainer({
  close,
  match: { params: { id } },
  rootPath,
  showSuccessDeleteMessage,
  history,
}) {
  const stripes = useStripes();
  const showCallout = useShowCallout();

  const { setting } = useInvoiceStorageSettingById(id, {
    onError: () => showCallout({
      message: <FormattedMessage id="ui-invoice.errors.cantLoadAdjustment" />,
      type: 'error',
    }),
  });

  const {
    deleteSetting,
  } = useInvoiceStorageSettingsMutation();

  const deleteAdjustment = useCallback(async () => {
    try {
      await deleteSetting({ id });
      close();
      showSuccessDeleteMessage();
    } catch (e) {
      showCallout({
        message: <FormattedMessage id="ui-invoice.settings.adjustments.remove.error" />,
        type: 'error',
      });
    }
  }, [close, deleteSetting, id, showCallout, showSuccessDeleteMessage]);

  const adjustment = useMemo(() => getSettingsAdjustmentsList([setting])[0], [setting]);

  return (
    <SettingsAdjustmentsView
      adjustment={adjustment}
      close={close}
      onDelete={deleteAdjustment}
      rootPath={rootPath}
      stripes={stripes}
      history={history}
    />
  );
}

SettingsAdjustmentsViewContainer.propTypes = {
  close: PropTypes.func.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  rootPath: PropTypes.string.isRequired,
  showSuccessDeleteMessage: PropTypes.func.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
};

export default SettingsAdjustmentsViewContainer;
