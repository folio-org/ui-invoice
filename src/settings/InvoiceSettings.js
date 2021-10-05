import React from 'react';
import { FormattedMessage } from 'react-intl';

import { Settings } from '@folio/stripes/smart-components';
import {
  CommandList,
  defaultKeyboardShortcuts,
} from '@folio/stripes/components';

import SettingsApprovals from './ApprovalSettings';
import SettingsAdjustments from './adjustments';
import { BatchGroupsSettings } from './BatchGroupsSettings';
import { BatchGroupConfigurationSettings } from './BatchGroupConfigurationSettings';
import SettingsVoucherNumber from './VoucherNumber';

export default class InvoiceSettings extends React.Component {
  sections = [
    {
      label: <FormattedMessage id="ui-invoice.settings.general.label" />,
      pages: [
        {
          route: 'approvals',
          label: <FormattedMessage id="ui-invoice.settings.approvals.label" />,
          component: SettingsApprovals,
        },
        {
          route: 'adjustments',
          label: <FormattedMessage id="ui-invoice.settings.adjustments.label" />,
          component: SettingsAdjustments,
        },
      ],
    },
    {
      label: <FormattedMessage id="ui-invoice.settings.vouchers.label" />,
      pages: [
        {
          route: 'batch-groups',
          label: <FormattedMessage id="ui-invoice.settings.batchGroups.label" />,
          component: BatchGroupsSettings,
        },
        {
          route: 'batch-group-configuration',
          label: <FormattedMessage id="ui-invoice.settings.batchGroupConfiguration.label" />,
          component: BatchGroupConfigurationSettings,
        },
        {
          route: 'voucher-number',
          label: <FormattedMessage id="ui-invoice.settings.voucherNumber.label" />,
          component: SettingsVoucherNumber,
        },
      ],
    },
  ];

  render() {
    return (
      <CommandList commands={defaultKeyboardShortcuts}>
        <Settings
          {...this.props}
          sections={this.sections}
          paneTitle={<FormattedMessage id="ui-invoice.settings.paneTitle" />}
        />
      </CommandList>
    );
  }
}
