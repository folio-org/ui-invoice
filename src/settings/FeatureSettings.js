import React from 'react';
import PropTypes from 'prop-types';

import { Pane } from '@folio/stripes/components';

export default class FeatureSettings extends React.Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
  };

  render() {
    return (
      <Pane defaultWidth="fill" fluidContentWidth paneTitle={this.props.label}>
        <div data-test-application-settings-feature-message>
          These are your settings for some app feature.
        </div>
      </Pane>
    );
  }
}
