import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';

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
  resources,
  rootPath,
  showSuccessDeleteMessage,
  stripes,
  history,
}) {
  const sendCallout = useShowCallout();
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

  const adjustments = getSettingsAdjustmentsList(get(resources, 'configAdjustment.records', []));
  const adjustment = get(adjustments, '0');

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
  configAdjustment: CONFIG_ADJUSTMENT,
});

SettingsAdjustmentsViewContainer.propTypes = {
  close: PropTypes.func.isRequired,
  mutator: PropTypes.object.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  rootPath: PropTypes.string.isRequired,
  showSuccessDeleteMessage: PropTypes.func.isRequired,
  resources: PropTypes.object,
  stripes: PropTypes.object.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
};

export default stripesConnect(SettingsAdjustmentsViewContainer);
