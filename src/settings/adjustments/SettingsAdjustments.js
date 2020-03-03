import React, { Component } from 'react';
import {
  Route,
  Switch,
} from 'react-router-dom';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { FormattedMessage } from 'react-intl';

import { get } from 'lodash';

import { stripesShape } from '@folio/stripes/core';
import { Callout } from '@folio/stripes/components';

import { CONFIG_ADJUSTMENTS } from '../../common/resources';
import SettingsAdjustmentsList from './SettingsAdjustmentsList';
import SettingsAdjustmentsEditorContainer from './SettingsAdjustmentsEditor';
import SettingsAdjustmentsViewContainer from './SettingsAdjustmentsView';
import { getSettingsAdjustmentsList } from './util';

class SettingsAdjustments extends Component {
  static manifest = Object.freeze({
    configAdjustments: CONFIG_ADJUSTMENTS,
  });

  static propTypes = {
    label: PropTypes.node.isRequired,
    match: ReactRouterPropTypes.match.isRequired,
    history: ReactRouterPropTypes.history.isRequired,
    stripes: stripesShape.isRequired,
    resources: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.callout = React.createRef();
  }

  closePane = () => {
    const { history, match: { path } } = this.props;

    history.push(path);
  }

  showSuccessDeleteMessage = () => {
    this.callout.current.sendCallout({
      type: 'success',
      message: <FormattedMessage id="ui-invoice.settings.adjustments.remove.success" />,
    });
  }

  render() {
    const { label, match: { path }, resources } = this.props;
    const adjustments = getSettingsAdjustmentsList(get(resources, ['configAdjustments', 'records'], []));

    return (
      <>
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
                close={this.closePane}
              />
            )}
          />
          <Route
            path={`${path}/:id/view`}
            render={(props) => (
              <SettingsAdjustmentsViewContainer
                {...props}
                close={this.closePane}
                rootPath={path}
                showSuccessDeleteMessage={this.showSuccessDeleteMessage}
              />
            )}
          />
          <Route
            exact
            path={`${path}/:id/edit`}
            render={(props) => (
              <SettingsAdjustmentsEditorContainer
                {...props}
                close={this.closePane}
              />
            )}
          />
        </Switch>
        <Callout ref={this.callout} />
      </>
    );
  }
}

export default SettingsAdjustments;
