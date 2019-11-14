import React from 'react';
import { FormattedMessage } from 'react-intl';

import { Settings } from '@folio/stripes/smart-components';

import SettingsApprovals from './ApprovalSettings';
import SettingsAdjustments from './adjustments';
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
      <Settings
        {...this.props}
        sections={this.sections}
        paneTitle={<FormattedMessage id="ui-invoice.settings.paneTitle" />}
      />
    );
  }
}
