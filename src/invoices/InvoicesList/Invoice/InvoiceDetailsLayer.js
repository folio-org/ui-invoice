import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import ReactRouterPropTypes from 'react-router-prop-types';

import { withTags } from '@folio/stripes/smart-components';

import { LoadingPane } from '../../../common/components';
import {
  invoiceResource,
  invoiceLinesResource,
  VENDOR,
} from '../../../common/resources';
import InvoiceDetails from '../../InvoiceDetails';
import { createInvoiceLineFromPOL } from './utils';

class InvoiceDetailsLayer extends Component {
  static manifest = Object.freeze({
    invoice: invoiceResource,
    invoiceLines: {
      ...invoiceLinesResource,
      fetch: false,
    },
    vendor: VENDOR,
    query: {},
  });

  static propTypes = {
    match: ReactRouterPropTypes.match,
    mutator: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    resources: PropTypes.object.isRequired,
    showToast: PropTypes.func.isRequired,
    tagsToggle: PropTypes.func.isRequired,
    tagsEnabled: PropTypes.bool,
  }

  static defaultProps = {
    tagsEnabled: false,
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
      tagsEnabled,
      tagsToggle,
    } = this.props;
    const invoice = get(resources, ['invoice', 'records', 0]);
    const hasLoaded = get(resources, 'invoice.hasLoaded');
    const totalInvoiceLines = get(resources, ['invoiceLines', 'other', 'totalRecords'], 0);
    const invoiceTotalUnits = get(resources, 'invoiceLines.records.0.invoiceLines', []).reduce((total, line) => (
      total + line.quantity
    ), 0);

    return hasLoaded
      ? (
        <InvoiceDetails
          addLines={this.addLines}
          createLine={this.createLine}
          onClose={onClose}
          onEdit={onEdit}
          invoice={invoice}
          totalInvoiceLines={totalInvoiceLines}
          invoiceTotalUnits={invoiceTotalUnits}
          deleteInvoice={this.deleteInvoice}
          tagsEnabled={tagsEnabled}
          tagsToggle={tagsToggle}
        />
      )
      : <LoadingPane onClose={onClose} />;
  }
}

export default withTags(InvoiceDetailsLayer);
