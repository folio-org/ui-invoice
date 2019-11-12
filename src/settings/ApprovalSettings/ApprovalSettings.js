import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ConfigManager } from '@folio/stripes/smart-components';
import { stripesShape } from '@folio/stripes/core';
import { getConfigSetting } from '@folio/stripes-acq-components';

import {
  CONFIG_MODULE_INVOICE,
  CONFIG_NAME_APPROVALS,
} from '../../common/constants';

import ApprovalSettingsForm from './ApprovalSettingsForm';

class ApprovalSettings extends Component {
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
        configName={CONFIG_NAME_APPROVALS}
        getInitialValues={getConfigSetting}
        label={label}
        moduleName={CONFIG_MODULE_INVOICE}
        onBeforeSave={this.beforeSave}
      >
        <div data-test-invoice-settings-approvals>
          <ApprovalSettingsForm />
        </div>
      </this.configManager>
    );
  }
}

export default ApprovalSettings;
