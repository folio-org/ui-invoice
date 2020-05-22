import React, { useCallback } from 'react';
import {
  Route,
  Switch,
} from 'react-router-dom';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';

import { useShowCallout } from '@folio/stripes-acq-components';

import { CONFIG_ADJUSTMENTS } from '../../common/resources';
import SettingsAdjustmentsList from './SettingsAdjustmentsList';
import SettingsAdjustmentsEditorContainer from './SettingsAdjustmentsEditor';
import SettingsAdjustmentsViewContainer from './SettingsAdjustmentsView';
import { getSettingsAdjustmentsList } from './util';

function SettingsAdjustments({ history, label, match: { path }, resources }) {
  const closePane = useCallback(() => {
    history.push(path);
  }, [history, path]);

  const sendCallout = useShowCallout();
  const showSuccessDeleteMessage = useCallback(() => {
    sendCallout({
      type: 'success',
      message: <FormattedMessage id="ui-invoice.settings.adjustments.remove.success" />,
    });
  }, [sendCallout]);

  const adjustments = getSettingsAdjustmentsList(get(resources, ['configAdjustments', 'records'], []));

  return (
    <Switch>
      <Route
        exact
        path={path}
        render={() => (
          <SettingsAdjustmentsList
            label={label}
            rootPath={path}
            adjustments={adjustments}
          />
        )}
      />
      <Route
        exact
        path={`${path}/create`}
        render={(props) => (
          <SettingsAdjustmentsEditorContainer
            {...props}
            close={closePane}
          />
        )}
      />
      <Route
        path={`${path}/:id/view`}
        render={(props) => (
          <SettingsAdjustmentsViewContainer
            {...props}
            close={closePane}
            rootPath={path}
            showSuccessDeleteMessage={showSuccessDeleteMessage}
          />
        )}
      />
      <Route
        exact
        path={`${path}/:id/edit`}
        render={(props) => (
          <SettingsAdjustmentsEditorContainer
            {...props}
            close={closePane}
          />
        )}
      />
    </Switch>
  );
}

SettingsAdjustments.manifest = Object.freeze({
  configAdjustments: CONFIG_ADJUSTMENTS,
});

SettingsAdjustments.propTypes = {
  label: PropTypes.node.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  resources: PropTypes.object.isRequired,
};

export default SettingsAdjustments;
