import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { ConfigManager } from '@folio/stripes/smart-components';

import { stripesShape } from '@folio/stripes/core';

import { CONFIG_MODULE_INVOICE, CONFIG_NAME_VOUCHER_NUMBER } from '../../common/constants';
import { getVoucherNumberSetting } from './util';
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

  beforeSave = (data) => {
    const {
      voucherNumberPrefix,
      sequenceNumber,
    } = data;

    return JSON.stringify({
      voucherNumberPrefix,
      sequenceNumber,
    });
  };

  render() {
    const { label } = this.props;

    return (
      <this.configManager
        configName={CONFIG_NAME_VOUCHER_NUMBER}
        getInitialValues={getVoucherNumberSetting}
        label={label}
        moduleName={CONFIG_MODULE_INVOICE}
        onBeforeSave={this.beforeSave}
        onAfterSave={(w) => console.log(w)}
      >
        <div data-test-invoice-settings-voucher-number>
          <SettingsVoucherNumberForm />
        </div>
      </this.configManager>
    );
  }
}

export default SettingsVoucherNumber;
