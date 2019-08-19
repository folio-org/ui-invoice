import React, { Component } from 'react';
import { get } from 'lodash';
import { getFormValues } from 'redux-form';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Callout } from '@folio/stripes/components';
import { ConfigManager } from '@folio/stripes/smart-components';
import { getConfigSetting } from '@folio/stripes-acq-components';

import { stripesShape } from '@folio/stripes/core';

import {
  CONFIG_MODULE_INVOICE,
  CONFIG_NAME_VOUCHER_NUMBER,
} from '../../common/constants';
import {
  VOUCHER_NUMBER_START,
} from '../../common/resources';

import SettingsVoucherNumberForm from './SettingsVoucherNumberForm';

class SettingsVoucherNumber extends Component {
  static manifest = Object.freeze({
    voucherNumber: VOUCHER_NUMBER_START,
  });

  static propTypes = {
    label: PropTypes.node.isRequired,
    stripes: stripesShape.isRequired,
    mutator: PropTypes.object.isRequired,
    resources: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.configManager = props.stripes.connect(ConfigManager);
    this.callout = React.createRef();
  }

  beforeSave = (data) => {
    const { allowVoucherNumberEdit } = data;

    if (allowVoucherNumberEdit) this.onReset();
    delete data.sequenceNumber;

    return JSON.stringify(data);
  };

  onReset = () => {
    const { mutator } = this.props;

    mutator.voucherNumber.POST({}).catch(() => {
      this.callout.current.sendCallout({
        type: 'error',
        message: <FormattedMessage id="ui-invoice.settings.voucherNumber.startNumber.error" />,
      });
    });
  };

  getStartSequenceNumber = () => {
    const { resources } = this.props;

    return get(resources, ['voucherNumber', 'records', 0, 'sequenceNumber'], '');
  };

  getInitialValues = (config) => {
    const sequenceNumber = this.getStartSequenceNumber();
    const configSetting = getConfigSetting(config);

    return {
      ...configSetting,
      sequenceNumber,
    };
  };

  render() {
    const { label, stripes } = this.props;

    const sequenceNumber = this.getStartSequenceNumber();
    const form = getFormValues('configForm')(stripes.store.getState());
    const allowVoucherNumberEdit = get(form, 'allowVoucherNumberEdit', false);

    return (
      <this.configManager
        configName={CONFIG_NAME_VOUCHER_NUMBER}
        getInitialValues={this.getInitialValues}
        label={label}
        moduleName={CONFIG_MODULE_INVOICE}
        onBeforeSave={this.beforeSave}
      >
        <div data-test-invoice-settings-voucher-number>
          <SettingsVoucherNumberForm
            onReset={this.onReset}
            firstSequenceNumber={sequenceNumber}
            allowVoucherNumberEdit={allowVoucherNumberEdit}
          />
        </div>
        <Callout ref={this.callout} />
      </this.configManager>
    );
  }
}

export default SettingsVoucherNumber;
