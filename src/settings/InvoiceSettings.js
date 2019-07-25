import React from 'react';
import { FormattedMessage } from 'react-intl';

import { Settings } from '@folio/stripes/smart-components';

import SettingsAdjustments from './adjustments';

export default class InvoiceSettings extends React.Component {
  pages = [
    {
      route: 'adjustments',
      label: <FormattedMessage id="ui-invoice.settings.adjustments.label" />,
      component: SettingsAdjustments,
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
