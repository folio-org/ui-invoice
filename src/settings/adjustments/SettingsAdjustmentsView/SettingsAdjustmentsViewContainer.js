import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { FormattedMessage } from 'react-intl';

import { get } from 'lodash';

import { Callout } from '@folio/stripes/components';
import { stripesConnect } from '@folio/stripes/core';

import { CONFIG_ADJUSTMENT } from '../../../common/resources';
import { getSettingsAdjustmentsList } from '../util';
import SettingsAdjustmentsView from './SettingsAdjustmentsView';

class SettingsAdjustmentsViewContainer extends Component {
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

  createCalloutRef = ref => {
    this.callout = ref;
  };

  deleteAdjustment = async () => {
    const { close, mutator: { configAdjustment }, match: { params: { id } }, showSuccessDeleteMessage } = this.props;

    try {
      await configAdjustment.DELETE({ id });
      close();
      showSuccessDeleteMessage();
    } catch (e) {
      this.callout.sendCallout({
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
      <Fragment>
        <SettingsAdjustmentsView
          adjustment={adjustment}
          close={close}
          onDelete={this.deleteAdjustment}
          rootPath={rootPath}
        />
        <Callout ref={this.createCalloutRef} />
      </Fragment>
    );
  }
}

export default stripesConnect(SettingsAdjustmentsViewContainer);
