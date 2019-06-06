// eslint-disable-next-line filenames/match-exported
import React from 'react';
import PropTypes from 'prop-types';
import Switch from 'react-router-dom/Switch';
import Route from 'react-router-dom/Route';

import { stripesShape } from '@folio/stripes/core';

import Invoices from './invoices';
import Settings from './settings';

class Invoice extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    showSettings: PropTypes.bool,
    stripes: stripesShape.isRequired,
  };

  constructor(props) {
    super(props);

    this.connectedInvoices = props.stripes.connect(Invoices);
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
          component={this.connectedInvoices}
        />
      </Switch>
    );
  }
}

export default Invoice;
