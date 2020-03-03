import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { withRouter } from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';

import {
  Paneset,
} from '@folio/stripes/components';
import { stripesConnect } from '@folio/stripes/core';

import {
  CONFIG_ADJUSTMENTS,
  invoiceLineResource,
  invoiceResource,
  VENDOR,
} from '../../common/resources';
import { LoadingPane } from '../../common/components';
import { getSettingsAdjustmentsList } from '../../settings/adjustments/util';
import InvoiceLineForm from './InvoiceLineForm';

class InvoiceLineFormContainer extends Component {
  static manifest = Object.freeze({
    invoice: invoiceResource,
    invoiceLine: invoiceLineResource,
    vendor: VENDOR,
    configAdjustments: CONFIG_ADJUSTMENTS,
  });

  saveInvoiceLine = (invoiceLine) => {
    const { onClose, mutator, showCallout } = this.props;
    const mutatorMethod = invoiceLine.id ? 'PUT' : 'POST';

    mutator.invoiceLine[mutatorMethod](invoiceLine)
      .then(() => {
        showCallout({ messageId: 'ui-invoice.invoiceLine.hasBeenSaved' });
        onClose();
      })
      .catch(() => {
        showCallout({ messageId: 'ui-invoice.errors.invoiceLineHasNotBeenSaved', type: 'error' });

        return { id: 'Unable to save invoice line' };
      });
  }

  hasLoaded() {
    const { match: { params: { lineId } }, resources: { invoiceLine, invoice, vendor } } = this.props;

    return (!lineId || get(invoiceLine, 'hasLoaded')) && get(invoice, 'hasLoaded') && get(vendor, 'hasLoaded');
  }

  render() {
    const {
      match: { params: { id, lineId } },
      onClose,
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
    const adjustmentsPresets = getSettingsAdjustmentsList(get(resources, ['configAdjustments', 'records'], []));

    return (this.hasLoaded()
      ? (
        <InvoiceLineForm
          stripes={stripes}
          initialValues={invoiceLine}
          onSubmit={this.saveInvoiceLine}
          onCancel={onClose}
          vendorCode={vendorCode}
          accounts={accounts}
          invoice={invoice}
          adjustmentsPresets={adjustmentsPresets}
        />
      )
      : (
        <Paneset>
          <LoadingPane onClose={onClose} />
        </Paneset>
      )
    );
  }
}

InvoiceLineFormContainer.propTypes = {
  onClose: PropTypes.func.isRequired,
  resources: PropTypes.object.isRequired,
  stripes: PropTypes.object.isRequired,
  showCallout: PropTypes.func.isRequired,
  match: ReactRouterPropTypes.match,
  mutator: PropTypes.object.isRequired,
};

export default withRouter(stripesConnect(InvoiceLineFormContainer));
