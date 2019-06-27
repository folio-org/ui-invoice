import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import ReactRouterPropTypes from 'react-router-prop-types';

import { LoadingPane } from '../../../common/components';
import { invoiceLineResource } from '../../../common/resources';
import InvoiceLineDetails from '../../InvoiceLineDetails';

class InvoiceLineDetailsLayer extends Component {
  static manifest = Object.freeze({
    invoiceLine: invoiceLineResource,
    query: {},
  });

  static propTypes = {
    match: ReactRouterPropTypes.match,
    mutator: PropTypes.object.isRequired,
    resources: PropTypes.object.isRequired,
    showToast: PropTypes.func.isRequired,
  }

  getInvoiceLine = () => get(this.props.resources, ['invoiceLine', 'records', 0]);

  closeInvoiceLine = () => {
    const { match: { params }, mutator } = this.props;
    const _path = `/invoice/view/${params.id}`;

    mutator.query.update({ _path });
  }

  goToEditInvoiceLine = () => {
    const { match: { params }, mutator } = this.props;
    const _path = `/invoice/view/${params.id}/line/${params.lineId}/edit`;

    mutator.query.update({ _path });
  }

  deleteInvoiceLine = () => {
    const { match: { params: { lineId } }, mutator, showToast } = this.props;

    mutator.invoiceLine.DELETE({ id: lineId })
      .then(() => {
        showToast('ui-invoice.invoiceLine.hasBeenDeleted');
        this.closeInvoiceLine();
      })
      .catch(() => {
        showToast('ui-invoice.errors.invoiceLineHasNotBeenDeleted', 'error');
      });
  }

  render() {
    const {
      resources,
    } = this.props;
    const invoiceLine = this.getInvoiceLine();
    const hasLoaded = get(resources, 'invoiceLine.hasLoaded');

    return hasLoaded
      ? (
        <InvoiceLineDetails
          closeInvoiceLine={this.closeInvoiceLine}
          deleteInvoiceLine={this.deleteInvoiceLine}
          goToEditInvoiceLine={this.goToEditInvoiceLine}
          invoiceLine={invoiceLine}
        />
      )
      : <LoadingPane onClose={this.closeInvoiceLine} />;
  }
}

export default InvoiceLineDetailsLayer;
