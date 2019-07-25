import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import ReactRouterPropTypes from 'react-router-prop-types';

import { LoadingPane } from '../../../common/components';
import {
  invoiceResource,
  invoiceLinesResource,
} from '../../../common/resources';
import { BASE_RESOURCE } from '../../../common/resources/base';
import { VENDORS_API } from '../../../common/constants';
import InvoiceDetails from '../../InvoiceDetails';
import { createInvoiceLineFromPOL } from './utils';

class InvoiceDetailsLayer extends Component {
  static manifest = Object.freeze({
    invoice: invoiceResource,
    invoiceLines: {
      ...invoiceLinesResource,
      fetch: false,
    },
    vendor: {
      ...BASE_RESOURCE,
      path: (queryParams, pathComponents, resourceData, logger, props) => {
        const vendorId = get(props, ['resources', 'invoice', 'records', 0, 'vendorId']);

        return vendorId ? `${VENDORS_API}/${vendorId}` : null;
      },
    },
    query: {},
  });

  static propTypes = {
    match: ReactRouterPropTypes.match,
    mutator: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    resources: PropTypes.object.isRequired,
    showToast: PropTypes.func.isRequired,
  }

  createLine = () => {
    const { match: { url }, mutator } = this.props;

    mutator.query.update({ _path: `${url}/line/create` });
  };

  addLines = poLines => {
    const { resources, mutator } = this.props;
    const { id: invoiceId } = get(resources, ['invoice', 'records', 0]);
    const vendor = get(resources, ['vendor', 'records', 0]);

    poLines.map(
      poLine => mutator.invoiceLines.POST(createInvoiceLineFromPOL(poLine, invoiceId, vendor)),
    );
  }

  deleteInvoice = () => {
    const { match: { params: { id } }, mutator, onClose, showToast } = this.props;

    mutator.invoice.DELETE({ id })
      .then(() => {
        showToast('ui-invoice.invoice.invoiceHasBeenDeleted');
        onClose();
      })
      .catch(() => {
        showToast('ui-invoice.errors.invoiceHasNotBeenDeleted', 'error');
      });
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
          deleteInvoice={this.deleteInvoice}
        />
      )
      : <LoadingPane onClose={onClose} />;
  }
}

export default InvoiceDetailsLayer;
