import React, { useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { FormattedMessage } from 'react-intl';

import {
  stripesConnect,
} from '@folio/stripes/core';
import { useShowCallout } from '@folio/stripes-acq-components';

import { CONFIG_ADJUSTMENT } from '../../../common/resources';
import { getSettingsAdjustmentsList } from '../util';
import SettingsAdjustmentsView from './SettingsAdjustmentsView';

function SettingsAdjustmentsViewContainer({
  close,
  match: { params: { id } },
  mutator: { configAdjustment },
  rootPath,
  showSuccessDeleteMessage,
  stripes,
  history,
}) {
  const sendCallout = useShowCallout();
  const [adjustment, setAdjustment] = useState();

  useEffect(() => {
    configAdjustment.GET()
      .then(response => {
        const adj = getSettingsAdjustmentsList([response]);

        setAdjustment(adj[0]);
      })
      .catch(() => sendCallout({
        message: <FormattedMessage id="ui-invoice.errors.cantLoadAdjustment" />,
        type: 'error',
      }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, sendCallout]);

  const deleteAdjustment = useCallback(async () => {
    try {
      await configAdjustment.DELETE({ id });
      close();
      showSuccessDeleteMessage();
    } catch (e) {
      sendCallout({
        message: <FormattedMessage id="ui-invoice.settings.adjustments.remove.error" />,
        type: 'error',
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [close, id, sendCallout, showSuccessDeleteMessage]);

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

SettingsAdjustmentsViewContainer.manifest = Object.freeze({
  configAdjustment: {
    ...CONFIG_ADJUSTMENT,
    fetch: false,
    accumulate: true,
  },
});

SettingsAdjustmentsViewContainer.propTypes = {
  close: PropTypes.func.isRequired,
  mutator: PropTypes.object.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  rootPath: PropTypes.string.isRequired,
  showSuccessDeleteMessage: PropTypes.func.isRequired,
  stripes: PropTypes.object.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
};

export default stripesConnect(SettingsAdjustmentsViewContainer);
