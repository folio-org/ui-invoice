import React from 'react';
import { FormattedMessage } from 'react-intl';

import { Settings } from '@folio/stripes/smart-components';

import SettingsAdjustments from './adjustments';
import SettingsVoucherNumber from './VoucherNumber';

export default class InvoiceSettings extends React.Component {
  pages = [
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
  ];

  render() {
    return (
      <Settings
        {...this.props}
        pages={this.pages}
        paneTitle={<FormattedMessage id="ui-invoice.settings.paneTitle" />}
      />
    );
  }
}
