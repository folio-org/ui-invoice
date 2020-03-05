import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { FormattedMessage } from 'react-intl';

import { get } from 'lodash';

import {
  CalloutContext,
  stripesConnect,
} from '@folio/stripes/core';

import { CONFIG_ADJUSTMENT } from '../../../common/resources';
import { getSettingsAdjustmentsList } from '../util';
import SettingsAdjustmentsView from './SettingsAdjustmentsView';

class SettingsAdjustmentsViewContainer extends Component {
  static contextType = CalloutContext;
  static manifest = Object.freeze({
    configAdjustment: CONFIG_ADJUSTMENT,
  });

  static propTypes = {
    close: PropTypes.func.isRequired,
    mutator: PropTypes.object.isRequired,
    match: ReactRouterPropTypes.match.isRequired,
    rootPath: PropTypes.string.isRequired,
    showSuccessDeleteMessage: PropTypes.func.isRequired,
    resources: PropTypes.object,
  };

  deleteAdjustment = async () => {
    const { close, mutator: { configAdjustment }, match: { params: { id } }, showSuccessDeleteMessage } = this.props;

    try {
      await configAdjustment.DELETE({ id });
      close();
      showSuccessDeleteMessage();
    } catch (e) {
      this.context.sendCallout({
        message: <FormattedMessage id="ui-invoice.settings.adjustments.remove.error" />,
        type: 'error',
      });
    }
  };

  render() {
    const { close, resources, rootPath } = this.props;
    const adjustments = getSettingsAdjustmentsList(get(resources, 'configAdjustment.records', []));
    const adjustment = get(adjustments, '0');

    return (
      <SettingsAdjustmentsView
        adjustment={adjustment}
        close={close}
        onDelete={this.deleteAdjustment}
        rootPath={rootPath}
      />
    );
  }
}

export default stripesConnect(SettingsAdjustmentsViewContainer);
