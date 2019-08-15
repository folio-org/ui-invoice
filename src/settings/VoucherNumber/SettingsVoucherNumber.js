import React, { Component } from 'react';
import { get } from 'lodash';
import PropTypes from 'prop-types';

import { ConfigManager } from '@folio/stripes/smart-components';
import { getConfigSetting } from '@folio/stripes-acq-components';

import { stripesShape } from '@folio/stripes/core';

import {
  CONFIG_MODULE_INVOICE,
  CONFIG_NAME_VOUCHER_NUMBER,
} from '../../common/constants';
import SettingsVoucherNumberForm from './SettingsVoucherNumberForm';
import { BASE_RESOURCE } from '../../common/resources/base';

export const VOUCHER_NUMBER_START = {
  ...BASE_RESOURCE,
  path: 'voucher-storage/voucher-number/start',
};

export const VOUCHER_NUMBER_RESET = {
  ...BASE_RESOURCE,
  fetch: false,
  path: 'voucher-storage/voucher-number/start/1',
  POST: {
    headers: {
      'Accept': 'text/plain',
      'Content-Type': 'text/plain',
    },
  },
};

class SettingsVoucherNumber extends Component {
  static manifest = Object.freeze({
    voucherNumber: VOUCHER_NUMBER_START,
    resetVoucherNumber: VOUCHER_NUMBER_RESET,
  });

  static propTypes = {
    label: PropTypes.node.isRequired,
    stripes: stripesShape.isRequired,
    mutator: PropTypes.shape({
      resetVoucherNumber: PropTypes.shape({
        POST: PropTypes.func.isRequired,
      }),
    }).isRequired,
    resources: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.configManager = props.stripes.connect(ConfigManager);
  }

  beforeSave = (data) => JSON.stringify(data);

  onReset = async () => {
    const { mutator } = this.props;

    await mutator.resetVoucherNumber.POST({});
  };

  render() {
    const { label, resources } = this.props;
    const sequenceNumber = get(resources, ['voucherNumber', 'records', 0, 'sequenceNumber'], '');

    return (
      <this.configManager
        configName={CONFIG_NAME_VOUCHER_NUMBER}
        getInitialValues={(config) => getConfigSetting(config, { sequenceNumber })}
        label={label}
        moduleName={CONFIG_MODULE_INVOICE}
        onBeforeSave={this.beforeSave}
      >
        <div data-test-invoice-settings-voucher-number>
          <SettingsVoucherNumberForm
            onReset={this.onReset}
            firstSequenceNumber={sequenceNumber}
          />
        </div>
      </this.configManager>
    );
  }
}

export default SettingsVoucherNumber;
