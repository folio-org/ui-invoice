import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import {
  stripesConnect,
  IfPermission,
} from '@folio/stripes/core';

import {
  invoiceResource,
} from '../../../../common/resources';
import PayInvoiceAction from './PayInvoiceAction';

const PayInvoiceActionContainer = ({ mutator, invoice }) => {
  return (
    <IfPermission perm="invoice.item.pay">
      <PayInvoiceAction
        invoice={invoice}
        saveInvoice={mutator.invoicePay.PUT}
      />
    </IfPermission>
  );
};

PayInvoiceActionContainer.manifest = Object.freeze({
  invoicePay: {
    ...invoiceResource,
    fetch: false,
    accumulate: true,
  },
});

PayInvoiceActionContainer.propTypes = {
  mutator: PropTypes.object.isRequired,
  invoice: PropTypes.object.isRequired,
};

export default withRouter(stripesConnect(PayInvoiceActionContainer));
