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
  }

  beforeSave = (data) => JSON.stringify(data);

  onReset = async () => {
    const { mutator } = this.props;

    await mutator.voucherNumber.POST({});
  };

  getStartSequenceNumber = () => {
    const { resources } = this.props;

    return get(resources, ['voucherNumber', 'records', 0, 'sequenceNumber'], '');
  };

  render() {
    const { label } = this.props;
    const sequenceNumber = this.getStartSequenceNumber();

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
