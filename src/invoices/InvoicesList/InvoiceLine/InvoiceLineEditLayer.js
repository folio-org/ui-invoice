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
  VENDOR,
} from '../../../common/resources';
import { LoadingPane } from '../../../common/components';
import { getSettingsAdjustmentsList } from '../../../settings/adjustments/util';
import InvoiceLineForm from '../../InvoiceLineForm';

class InvoiceLineEditLayer extends Component {
  static manifest = Object.freeze({
    invoice: invoiceResource,
    invoiceLine: invoiceLineResource,
    vendor: VENDOR,
  });

  saveInvoiceLine = (invoiceLine) => {
    const { onCloseEdit, mutator, showToast } = this.props;
    const mutatorMethod = invoiceLine.id ? 'PUT' : 'POST';

    mutator.invoiceLine[mutatorMethod](invoiceLine)
      .then(() => {
        showToast('ui-invoice.invoiceLine.hasBeenSaved');
        onCloseEdit();
      })
      .catch(() => {
        showToast('ui-invoice.errors.invoiceLineHasNotBeenSaved', 'error');

        return { id: 'Unable to save invoice line' };
      });
  }

  hasLoaded() {
    const { match: { params: { lineId } }, resources: { invoiceLine, invoice, vendor } } = this.props;

    return (!lineId || get(invoiceLine, 'hasLoaded')) && get(invoice, 'hasLoaded') && get(vendor, 'hasLoaded');
  }

  render() {
    const {
      connectedSource,
      intl,
      match: { params: { id, lineId } },
      onCloseEdit,
      parentMutator,
      parentResources,
      resources,
      stripes,
    } = this.props;
    const invoice = get(resources, ['invoice', 'records', 0], {});
    const invoiceLine = lineId
      ? get(resources, ['invoiceLine', 'records', 0])
      : {
        invoiceId: id,
        invoiceLineStatus: invoice.status,
        fundDistributions: [],
      };
    const vendor = get(resources, ['vendor', 'records', 0]);
    const vendorCode = get(vendor, 'erpCode', '');
    const accounts = get(vendor, 'accounts', []);
    const adjustmentsPresets = getSettingsAdjustmentsList(get(parentResources, ['configAdjustments', 'records'], []));

    return (
      <Layer
        isOpen
        contentLabel={intl.formatMessage({ id: 'ui-invoice.invoiceLine.editLayer' })}
      >
        {this.hasLoaded()
          ? (
            <InvoiceLineForm
              stripes={stripes}
              initialValues={invoiceLine}
              connectedSource={connectedSource}
              parentResources={parentResources}
              parentMutator={parentMutator}
              onSubmit={this.saveInvoiceLine}
              onCancel={onCloseEdit}
              vendorCode={vendorCode}
              accounts={accounts}
              invoice={invoice}
              adjustmentsPresets={adjustmentsPresets}
            />
          )
          : <LoadingPane onClose={onCloseEdit} />}

      </Layer>
    );
  }
}

InvoiceLineEditLayer.propTypes = {
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
};

export default injectIntl(InvoiceLineEditLayer);
