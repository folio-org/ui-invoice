import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import ReactRouterPropTypes from 'react-router-prop-types';

import { LoadingPane } from '../../../common/components';
import {
  invoiceResource,
  invoiceLinesResource,
} from '../../../common/resources';
import InvoiceDetails from '../../InvoiceDetails';

class InvoiceDetailsLayer extends Component {
  static manifest = Object.freeze({
    invoice: invoiceResource,
    invoiceLines: {
      ...invoiceLinesResource,
      fetch: false,
    },
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

  addLines = poLines => {
    const { resources, mutator } = this.props;
    const { id: invoiceId } = get(resources, ['invoice', 'records', 0]);

    poLines.map(({
      title: description,
      id: poLineId,
    }) => mutator.invoiceLines.POST({
      invoiceLineStatus: 'Open',
      quantity: 1,
      subTotal: 1000,
      fundDistributions: [{
        code: 'USHIST',
        encumbrance: '1c8fc9f4-d2cc-4bd1-aa9a-cb02291cbe65',
        fundId: '1d1574f1-9196-4a57-8d1f-3b2e4309eb81',
        percentage: 50,
      }],
      description,
      poLineId,
      invoiceId,
    }));
  }

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
          addLines={this.addLines}
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
