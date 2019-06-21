import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import ReactRouterPropTypes from 'react-router-prop-types';

import { LoadingPane } from '../../../common/components';
import {
  invoiceResource,
} from '../../../common/resources';
import InvoiceDetails from '../../InvoiceDetails';

class InvoiceDetailsLayer extends Component {
  static manifest = Object.freeze({
    invoice: invoiceResource,
    query: {},
  });

  static propTypes = {
    match: ReactRouterPropTypes.match,
    mutator: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    resources: PropTypes.object.isRequired,
  }

  createLine = () => {
    const { match: { url }, mutator } = this.props;

    mutator.query.update({ _path: `${url}/line/create` });
  };

  render() {
    const {
      onClose,
      onEdit,
      resources,
    } = this.props;
    const invoice = get(resources, ['invoice', 'records', 0]);
    const hasLoaded = get(resources, 'invoice.hasLoaded');

    return hasLoaded
      ? (
        <InvoiceDetails
          createLine={this.createLine}
          onClose={onClose}
          onEdit={onEdit}
          invoice={invoice}
        />
      )
      : <LoadingPane onClose={onClose} />;
  }
}

export default InvoiceDetailsLayer;
