import React, { Component } from 'react';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Callout } from '@folio/stripes/components';
import { ConfigManager } from '@folio/stripes/smart-components';
import { getConfigSetting } from '@folio/stripes-acq-components';

import { stripesShape } from '@folio/stripes/core';

import {
  CONFIG_MODULE_INVOICE,
  CONFIG_NAME_VOUCHER_NUMBER,
  DEFAULT_VOUCHER_START_NUMBER,
} from '../../common/constants';
import {
  VOUCHER_NUMBER_START,
} from '../../common/resources';

import SettingsVoucherNumberForm from './SettingsVoucherNumberForm';

class SettingsVoucherNumber extends Component {
  static manifest = Object.freeze({
    voucherNumber: VOUCHER_NUMBER_START,
    sequenceNumber: { initialValue: DEFAULT_VOUCHER_START_NUMBER },
  });

  static propTypes = {
    label: PropTypes.node.isRequired,
    stripes: stripesShape.isRequired,
    mutator: PropTypes.object.isRequired,
    resources: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.configManager = props.stripes.connect(ConfigManager);
    this.callout = React.createRef();
  }

  beforeSave = (data) => JSON.stringify(data);

  onReset = async () => {
    const { mutator } = this.props;

    try {
      await mutator.voucherNumber.POST({});
    } catch (e) {
      this.callout.current.sendCallout({
        type: 'error',
        message: (
          <FormattedMessage
            data-test-invoice-settings-voucher-number-error
            id="ui-invoice.settings.voucherNumber.startNumber.error"
          />
        ),
      });
    }
  };

  getStartSequenceNumber = () => {
    const { resources } = this.props;

    return get(resources, ['voucherNumber', 'records', 0, 'sequenceNumber'], '');
  };

  onChangeStartNumber = (e) => {
    const { mutator } = this.props;
    const { value } = e.target;

    mutator.sequenceNumber.replace(value);
  };

  render() {
    const { label } = this.props;

    const sequenceNumber = this.getStartSequenceNumber();

    return (
      <this.configManager
        configName={CONFIG_NAME_VOUCHER_NUMBER}
        getInitialValues={getConfigSetting}
        label={label}
        moduleName={CONFIG_MODULE_INVOICE}
        onBeforeSave={this.beforeSave}
      >
        <div data-test-invoice-settings-voucher-number>
          <SettingsVoucherNumberForm
            onReset={this.onReset}
            sequenceNumber={sequenceNumber}
            onChangeStartNumber={this.onChangeStartNumber}
          />
        </div>
        <Callout ref={this.callout} />
      </this.configManager>
    );
  }
}

export default SettingsVoucherNumber;
