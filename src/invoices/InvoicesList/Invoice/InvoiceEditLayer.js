import React, { Component } from 'react';
import {
  injectIntl,
  intlShape,
} from 'react-intl';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import {
  Layer,
} from '@folio/stripes/components';

import {
  invoiceResource,
  invoiceDocumentsResource,
} from '../../../common/resources';
import { LoadingPane } from '../../../common/components';
import {
  saveInvoice,
} from '../utils';
import InvoiceForm from '../../InvoiceForm';

class InvoiceEditLayer extends Component {
  static manifest = Object.freeze({
    invoice: invoiceResource,
    invoiceDocuments: {
      ...invoiceDocumentsResource,
      accumulate: true,
    },
  });

  static propTypes = {
    connectedSource: PropTypes.object.isRequired,
    onCloseEdit: PropTypes.func.isRequired,
    parentResources: PropTypes.object.isRequired,
    parentMutator: PropTypes.object.isRequired,
    resources: PropTypes.object.isRequired,
    mutator: PropTypes.object.isRequired,
    stripes: PropTypes.object.isRequired,
    okapi: PropTypes.object.isRequired,
    intl: intlShape.isRequired,
    showToast: PropTypes.func.isRequired,
  }

  componentDidMount() {
    this.props.mutator.invoiceDocuments.reset();
    this.props.mutator.invoiceDocuments.GET();
  }

  saveInvoice = (invoice) => {
    const { onCloseEdit, parentMutator, showToast, okapi, resources } = this.props;

    saveInvoice(invoice, resources.invoiceDocuments.records, parentMutator.records, okapi)
      .then(() => {
        showToast('ui-invoice.invoice.invoiceHasBeenSaved');
        onCloseEdit();
      })
      .catch(() => {
        showToast('ui-invoice.errors.invoiceHasNotBeenSaved', 'error');

        return { id: 'Unable to save invoice' };
      });
  }

  render() {
    const {
      connectedSource,
      intl,
      onCloseEdit,
      parentMutator,
      parentResources,
      resources,
      stripes,
    } = this.props;

    if (!get(resources, 'invoiceDocuments.hasLoaded', false)) return false;

    const invoiceDocuments = get(resources, 'invoiceDocuments.records', []);
    const invoice = {
      ...get(resources, ['invoice', 'records', 0]),
      documents: invoiceDocuments.filter(invoiceDocument => !invoiceDocument.url),
      links: invoiceDocuments.filter(invoiceDocument => invoiceDocument.url),
    };
    const hasLoaded = get(resources, 'invoice.hasLoaded');

    return (
      <Layer
        isOpen
        contentLabel={intl.formatMessage({ id: 'ui-invoice.invoice.editLayer' })}
      >
        {hasLoaded
          ? (
            <InvoiceForm
              stripes={stripes}
              initialValues={invoice}
              connectedSource={connectedSource}
              parentResources={parentResources}
              parentMutator={parentMutator}
              onSubmit={this.saveInvoice}
              onCancel={onCloseEdit}
            />
          )
          : <LoadingPane onClose={onCloseEdit} />
        }

      </Layer>
    );
  }
}

export default injectIntl(InvoiceEditLayer);
