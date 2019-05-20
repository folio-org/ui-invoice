// eslint-disable-next-line filenames/match-exported
import React from 'react';
import PropTypes from 'prop-types';
import Switch from 'react-router-dom/Switch';
import Route from 'react-router-dom/Route';

import Settings from './settings';

/*
  STRIPES-NEW-APP
  This is the main entry point into your new app.
*/

class Invoice extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    showSettings: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    this.connectedApp = props.stripes.connect(() => null);
  }

  render() {
    const {
      showSettings,
      match: {
        path,
      },
    } = this.props;

    if (showSettings) {
      return <Settings {...this.props} />;
    }

    return (
      <Switch>
        <Route
          path={path}
          exact
          component={this.connectedApp}
        />
      </Switch>
    );
  }
}

export default Invoice;
