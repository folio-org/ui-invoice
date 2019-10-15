// eslint-disable-next-line filenames/match-exported
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  Switch,
  Route,
} from 'react-router-dom';

import { stripesShape } from '@folio/stripes/core';
import { Callout } from '@folio/stripes/components';
import {
  ToastContext,
} from '@folio/stripes-acq-components';

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

    this.callout = React.createRef();

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
      <Fragment>
        <ToastContext.Provider value={this.callout}>
          <Switch>
            <Route
              path={path}
              component={this.connectedInvoices}
            />
          </Switch>
        </ToastContext.Provider>
        <Callout ref={this.callout} />
      </Fragment>
    );
  }
}

export default Invoice;
