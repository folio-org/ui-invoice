import React, { Component } from 'react';
import {
  injectIntl,
  intlShape,
} from 'react-intl';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import ReactRouterPropTypes from 'react-router-prop-types';

import {
  Layer,
} from '@folio/stripes/components';

import {
  invoiceLineResource,
  invoiceResource,
} from '../../../common/resources';
import { LoadingPane } from '../../../common/components';
import InvoiceLineForm from '../../InvoiceLineForm';

class InvoiceLineEditLayer extends Component {
  static manifest = Object.freeze({
    invoice: invoiceResource,
    invoiceLine: invoiceLineResource,
  });

  static propTypes = {
    connectedSource: PropTypes.object.isRequired,
    onCloseEdit: PropTypes.func.isRequired,
    parentResources: PropTypes.object.isRequired,
    parentMutator: PropTypes.object.isRequired,
    resources: PropTypes.object.isRequired,
    stripes: PropTypes.object.isRequired,
    intl: intlShape.isRequired,
    showToast: PropTypes.func.isRequired,
    match: ReactRouterPropTypes.match,
    mutator: PropTypes.object.isRequired,
  }

  saveInvoiceLine = (invoiceLine) => {
    const { onCloseEdit, mutator, showToast } = this.props;

    mutator.invoiceLine.PUT(invoiceLine)
      .then(() => {
        showToast('ui-invoice.invoiceLine.hasBeenSaved');
        onCloseEdit();
      })
      .catch(() => {
        showToast('ui-invoice.errors.invoiceLineHasNotBeenSaved', 'error');

        return { id: 'Unable to save invoice line' };
      });
  }

  render() {
    const {
      connectedSource,
      intl,
      match: { params: { lineId } },
      onCloseEdit,
      parentMutator,
      parentResources,
      resources,
      stripes,
    } = this.props;
    const invoiceLine = get(resources, ['invoiceLine', 'records', 0], {});
    const hasLoaded = (!lineId || get(resources, 'invoiceLine.hasLoaded')) && get(resources, 'invoice.hasLoaded');

    return (
      <Layer
        isOpen
        contentLabel={intl.formatMessage({ id: 'ui-invoice.invoiceLine.editLayer' })}
      >
        {hasLoaded
          ? (
            <InvoiceLineForm
              stripes={stripes}
              initialValues={invoiceLine}
              connectedSource={connectedSource}
              parentResources={parentResources}
              parentMutator={parentMutator}
              onSubmit={this.saveInvoiceLine}
              onCancel={onCloseEdit}
            />
          )
          : <LoadingPane onClose={onCloseEdit} />
        }

      </Layer>
    );
  }
}

export default injectIntl(InvoiceLineEditLayer);
