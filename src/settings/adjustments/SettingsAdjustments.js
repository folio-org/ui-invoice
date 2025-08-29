import PropTypes from 'prop-types';
import { useCallback } from 'react';
import {
  Route,
  Switch,
} from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import ReactRouterPropTypes from 'react-router-prop-types';

import {
  PermissionedRoute,
  useShowCallout,
} from '@folio/stripes-acq-components';

import { useAdjustmentsSettings } from '../../common/hooks';
import { SettingsAdjustmentsCreate } from './SettingsAdjustmentsCreate';
import { SettingsAdjustmentsEdit } from './SettingsAdjustmentsEdit';
import SettingsAdjustmentsList from './SettingsAdjustmentsList';
import SettingsAdjustmentsViewContainer from './SettingsAdjustmentsView';

import { getSettingsAdjustmentsList } from './util';

export const RETURN_LINK_LABEL_ID = 'ui-invoice.settings.adjustments.label';

function SettingsAdjustments({ history, label, match: { path } }) {
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

  const {
    refetch,
    settings,
  } = useAdjustmentsSettings();

  const adjustments = getSettingsAdjustmentsList(settings);

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
      <PermissionedRoute
        exact
        perm="ui-invoice.settings.all"
        path={`${path}/create`}
        returnLink={path}
        returnLinkLabelId={RETURN_LINK_LABEL_ID}
      >
        <SettingsAdjustmentsCreate
          onClose={closePane}
          refetch={refetch}
        />
      </PermissionedRoute>
      <Route
        path={`${path}/:id/view`}
        render={(props) => (
          <SettingsAdjustmentsViewContainer
            {...props}
            close={closePane}
            refetch={refetch}
            rootPath={path}
            showSuccessDeleteMessage={showSuccessDeleteMessage}
          />
        )}
      />
      <PermissionedRoute
        exact
        perm="ui-invoice.settings.all"
        path={`${path}/:id/edit`}
        returnLink={path}
        returnLinkLabelId={RETURN_LINK_LABEL_ID}
      >
        <SettingsAdjustmentsEdit
          onClose={closePane}
          refetch={refetch}
        />
      </PermissionedRoute>
    </Switch>
  );
}

SettingsAdjustments.propTypes = {
  label: PropTypes.node.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
};

export default SettingsAdjustments;
