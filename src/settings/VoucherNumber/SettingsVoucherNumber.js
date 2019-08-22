import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ConfigManager } from '@folio/stripes/smart-components';
import { getConfigSetting } from '@folio/stripes-acq-components';

import { stripesShape } from '@folio/stripes/core';

import {
  CONFIG_MODULE_INVOICE,
  CONFIG_NAME_VOUCHER_NUMBER,
} from '../../common/constants';

import SettingsVoucherNumberForm from './SettingsVoucherNumberForm';

class SettingsVoucherNumber extends Component {
  static propTypes = {
    label: PropTypes.node.isRequired,
    stripes: stripesShape.isRequired,
  };

  constructor(props) {
    super(props);

    this.configManager = props.stripes.connect(ConfigManager);
  }

  beforeSave = (data) => JSON.stringify(data);

  render() {
    const { label } = this.props;

    return (
      <this.configManager
        configName={CONFIG_NAME_VOUCHER_NUMBER}
        getInitialValues={getConfigSetting}
        label={label}
        moduleName={CONFIG_MODULE_INVOICE}
        onBeforeSave={this.beforeSave}
      >
        <div data-test-invoice-settings-voucher-number>
          <SettingsVoucherNumberForm />
        </div>
      </this.configManager>
    );
  }
}

export default SettingsVoucherNumber;
