import React, { Component } from 'react';
import Switch from 'react-router-dom/Switch';
import Route from 'react-router-dom/Route';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import queryString from 'query-string';

import { stripesShape } from '@folio/stripes/core';

import Voucher from '../../Voucher/Voucher';
import InvoiceDetailsLayer from './InvoiceDetailsLayer';
import InvoiceEditLayer from './InvoiceEditLayer';
import InvoiceLine from '../InvoiceLine/InvoiceLine';

class Invoice extends Component {
  static propTypes = {
    location: ReactRouterPropTypes.location,
    parentMutator: PropTypes.object.isRequired,
    parentResources: PropTypes.object.isRequired,
    match: ReactRouterPropTypes.match,
    stripes: stripesShape.isRequired,
  }

  constructor(props) {
    super(props);

    this.connectedInvoiceEditLayer = props.stripes.connect(InvoiceEditLayer);
  }

  render() {
    const { location, match: { path } } = this.props;
    const { layer } = queryString.parse(location.search);

    return (
      <Switch>
        <Route
          path={`${path}/line/`}
          render={
            props => (
              <InvoiceLine
                {...this.props}
                {...props}
              />
            )
          }
        />
        <Route
          exact
          path={path}
          render={
            props => {
              const LayerComponent = layer === 'edit'
                ? this.connectedInvoiceEditLayer
                : InvoiceDetailsLayer;

              return (
                <LayerComponent
                  {...this.props}
                  {...props}
                />
              );
            }
          }
        />
        <Route
          path={`${path}/voucher/`}
          render={
            props => (
              <Voucher
                {...this.props}
                {...props}
              />
            )
          }
        />
      </Switch>
    );
  }
}

export default Invoice;
