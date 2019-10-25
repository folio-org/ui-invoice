import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import ReactRouterPropTypes from 'react-router-prop-types';

import {
  LoadingPane,
  Tags,
} from '@folio/stripes-acq-components';

import {
  invoiceLineResource,
  invoiceResource,
} from '../../../common/resources';
import InvoiceLineDetails from '../../InvoiceLineDetails';

class InvoiceLineDetailsLayer extends Component {
  static manifest = Object.freeze({
    invoiceLine: invoiceLineResource,
    invoice: invoiceResource,
    query: {},
  });

  static propTypes = {
    match: ReactRouterPropTypes.match,
    mutator: PropTypes.object.isRequired,
    resources: PropTypes.object.isRequired,
    showToast: PropTypes.func.isRequired,
  }

  state = {
    isTagsPaneOpened: false,
  };

  toggleTagsPane = () => this.setState(({ isTagsPaneOpened }) => ({ isTagsPaneOpened: !isTagsPaneOpened }));

  getInvoiceLine = () => get(this.props.resources, ['invoiceLine', 'records', 0]);

  getInvoice = () => get(this.props.resources, ['invoice', 'records', 0]);

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
      mutator,
      resources,
    } = this.props;
    const { isTagsPaneOpened } = this.state;

    const invoiceLine = this.getInvoiceLine();
    const invoice = this.getInvoice();
    const hasLoaded = get(resources, 'invoiceLine.hasLoaded') && get(resources, 'invoice.hasLoaded');

    return hasLoaded
      ? (
        <Fragment>
          <InvoiceLineDetails
            closeInvoiceLine={this.closeInvoiceLine}
            currency={invoice.currency}
            deleteInvoiceLine={this.deleteInvoiceLine}
            goToEditInvoiceLine={this.goToEditInvoiceLine}
            invoiceLine={invoiceLine}
            tagsToggle={this.toggleTagsPane}
          />
          {isTagsPaneOpened && (
            <Tags
              putMutator={mutator.invoiceLine.PUT}
              recordObj={invoiceLine}
              onClose={this.toggleTagsPane}
            />
          )}
        </Fragment>
      )
      : <LoadingPane onClose={this.closeInvoiceLine} />;
  }
}

export default InvoiceLineDetailsLayer;
