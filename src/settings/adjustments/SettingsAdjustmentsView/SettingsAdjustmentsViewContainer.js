import PropTypes from 'prop-types';
import {
  useCallback,
  useMemo,
} from 'react';
import { FormattedMessage } from 'react-intl';
import ReactRouterPropTypes from 'react-router-prop-types';

import {
  Layer,
  LoadingView,
} from '@folio/stripes/components';
import { useStripes } from '@folio/stripes/core';
import { useShowCallout } from '@folio/stripes-acq-components';

import {
  useAdjustmentsSetting,
  useAdjustmentsSettingsMutation,
} from '../../hooks';
import { getSettingsAdjustmentsList } from '../util';
import SettingsAdjustmentsView from './SettingsAdjustmentsView';

function SettingsAdjustmentsViewContainer({
  close,
  match: { params: { id } },
  refetch,
  rootPath,
  showSuccessDeleteMessage,
  history,
}) {
  const stripes = useStripes();
  const showCallout = useShowCallout();

  const {
    isFetching,
    setting,
  } = useAdjustmentsSetting(id, {
    onError: () => showCallout({
      message: <FormattedMessage id="ui-invoice.errors.cantLoadAdjustment" />,
      type: 'error',
    }),
  });

  const { deleteSetting } = useAdjustmentsSettingsMutation();

  const deleteAdjustment = useCallback(async () => {
    try {
      await deleteSetting({ id });
      refetch();
      close();
      showSuccessDeleteMessage();
    } catch (e) {
      showCallout({
        message: <FormattedMessage id="ui-invoice.settings.adjustments.remove.error" />,
        type: 'error',
      });
    }
  }, [close, deleteSetting, id, refetch, showCallout, showSuccessDeleteMessage]);

  const adjustment = useMemo(() => setting && getSettingsAdjustmentsList([setting])[0], [setting]);

  if (isFetching) {
    return (
      <Layer isOpen>
        <LoadingView />
      </Layer>
    );
  }

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
  history: ReactRouterPropTypes.history.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  refetch: PropTypes.func.isRequired,
  rootPath: PropTypes.string.isRequired,
  showSuccessDeleteMessage: PropTypes.func.isRequired,
};

export default SettingsAdjustmentsViewContainer;
