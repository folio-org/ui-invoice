import React, { Component } from 'react';
import Switch from 'react-router-dom/Switch';
import Route from 'react-router-dom/Route';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';

import { stripesShape } from '@folio/stripes/core';

import InvoiceDetailsLayer from './InvoiceDetailsLayer';

class Invoice extends Component {
  static propTypes = {
    parentMutator: PropTypes.object.isRequired,
    parentResources: PropTypes.object.isRequired,
    match: ReactRouterPropTypes.match,
    stripes: stripesShape.isRequired,
  }

  constructor(props) {
    super(props);

    this.connectedInvoiceDetailsLayer = props.stripes.connect(InvoiceDetailsLayer);
  }

  render() {
    const { match: { path } } = this.props;

    return (
      <Switch>
        <Route
          exact
          path={path}
          render={
            props => {
              return (
                <this.connectedInvoiceDetailsLayer
                  {...this.props}
                  {...props}
                />
              );
            }
          }
        />
      </Switch>
    );
  }
}

export default Invoice;
