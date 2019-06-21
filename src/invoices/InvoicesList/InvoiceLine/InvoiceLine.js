import React, { Component } from 'react';
import Switch from 'react-router-dom/Switch';
import Route from 'react-router-dom/Route';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';

import { stripesShape } from '@folio/stripes/core';

import InvoiceLineDetailsLayer from './InvoiceLineDetailsLayer';
import InvoiceLineEditLayer from './InvoiceLineEditLayer';

class InvoiceLine extends Component {
  static propTypes = {
    location: ReactRouterPropTypes.location,
    parentMutator: PropTypes.object.isRequired,
    parentResources: PropTypes.object.isRequired,
    match: ReactRouterPropTypes.match,
    stripes: stripesShape.isRequired,
  }

  constructor(props) {
    super(props);

    this.connectedInvoiceLineDetailsLayer = props.stripes.connect(InvoiceLineDetailsLayer);
    this.connectedInvoiceLineEditLayer = props.stripes.connect(InvoiceLineEditLayer);
  }

  renderEditLayer = (props) => (
    <this.connectedInvoiceLineEditLayer
      {...this.props}
      {...props}
      onCloseEdit={this.onCloseEdit}
    />
  );

  onCloseEdit = () => {
    const { location: { pathname }, parentMutator } = this.props;

    parentMutator.query.update({ _path: pathname.replace('/line/', '') });
  }

  render() {
    const { match: { path } } = this.props;

    return (
      <Switch>
        <Route
          exact
          path={`${path}create`}
          render={this.renderEditLayer}
        />
        <Route
          exact
          path={`${path}:lineId/edit`}
          render={this.renderEditLayer}
        />
        <Route
          exact
          path={`${path}:lineId/view`}
          render={
            props => (
              <this.connectedInvoiceLineDetailsLayer
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

export default InvoiceLine;
