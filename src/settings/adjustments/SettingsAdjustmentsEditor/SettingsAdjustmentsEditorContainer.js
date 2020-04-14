import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { FormattedMessage } from 'react-intl';
import { getFormValues } from 'redux-form';

import { get } from 'lodash';

import { stripesConnect } from '@folio/stripes/core';

import {
  CONFIG_ADJUSTMENTS,
  CONFIG_ADJUSTMENT,
} from '../../../common/resources';
import {
  ADJUSTMENT_PRORATE_VALUES,
  ADJUSTMENT_RELATION_TO_TOTAL_VALUES,
  ADJUSTMENT_TYPE_VALUES,
  CONFIG_MODULE_INVOICE,
  CONFIG_NAME_ADJUSTMENTS,
} from '../../../common/constants';
import { getSettingsAdjustmentsList } from '../util';
import SettingsAdjustmentsEditor from './SettingsAdjustmentsEditor';

const INITIAL_VALUES = {
  alwaysShow: true,
  exportToAccounting: false,
  prorate: ADJUSTMENT_PRORATE_VALUES.notProrated,
  relationToTotal: ADJUSTMENT_RELATION_TO_TOTAL_VALUES.inAdditionTo,
  type: ADJUSTMENT_TYPE_VALUES.amount,
};

class SettingsAdjustmentsEditorContainer extends Component {
  static manifest = Object.freeze({
    configAdjustmentsList: {
      ...CONFIG_ADJUSTMENTS,
      fetch: false,
    },
    configAdjustment: CONFIG_ADJUSTMENT,
  });

  static propTypes = {
    close: PropTypes.func.isRequired,
    mutator: PropTypes.object.isRequired,
    resources: PropTypes.object.isRequired,
    match: ReactRouterPropTypes.match.isRequired,
    stripes: PropTypes.object.isRequired,
  };

  saveAdjustment = (values) => {
    const { close, mutator: { configAdjustmentsList, configAdjustment }, match, resources } = this.props;
    const id = get(match, ['params', 'id']);
    const mutatorFn = id ? configAdjustment.PUT : configAdjustmentsList.POST;
    const value = JSON.stringify(values);
    let body;

    if (id) {
      body = get(resources, ['configAdjustment', 'records', 0], {});
    } else {
      body = {
        module: CONFIG_MODULE_INVOICE,
        configName: CONFIG_NAME_ADJUSTMENTS,
        code: (new Date()).valueOf(),
      };
    }

    body = { ...body, value };

    mutatorFn(body).then(close);
  };

  render() {
    const { close, resources, match, stripes } = this.props;
    const formValues = getFormValues('SettingsAdjustmentsForm')(stripes.store.getState()) || INITIAL_VALUES;

    const adjustments = getSettingsAdjustmentsList(get(resources, 'configAdjustment.records', []));

    const id = get(match, ['params', 'id']);
    const adjustment = id
      ? get(adjustments, '0', {})
      : INITIAL_VALUES;
    const title = get(adjustment, 'adjustment.description') || <FormattedMessage id="ui-invoice.settings.adjustments.title.new" />;
    const initialValues = adjustment.adjustment || INITIAL_VALUES;

    return (
      <SettingsAdjustmentsEditor
        title={title}
        onSubmit={this.saveAdjustment}
        close={close}
        initialValues={initialValues}
        formValues={formValues}
        metadata={adjustment.metadata}
      />
    );
  }
}

export default stripesConnect(SettingsAdjustmentsEditorContainer);
