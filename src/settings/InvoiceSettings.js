import React from 'react';

import { Settings } from '@folio/stripes/smart-components';

import GeneralSettings from './GeneralSettings';
import SomeFeatureSettings from './FeatureSettings';

/*
  STRIPES-NEW-APP
  Your app's settings pages are defined here.
  The pages "general" and "some feature" are examples. Name them however you like.
*/

export default class InvoiceSettings extends React.Component {
  pages = [
    {
      route: 'general',
      label: 'General',
      component: GeneralSettings,
    },
    {
      route: 'somefeature',
      label: 'Some Feature',
      component: SomeFeatureSettings,
    },
  ];

  render() {
    return (
      <Settings {...this.props} pages={this.pages} paneTitle="invoice" />
    );
  }
}
