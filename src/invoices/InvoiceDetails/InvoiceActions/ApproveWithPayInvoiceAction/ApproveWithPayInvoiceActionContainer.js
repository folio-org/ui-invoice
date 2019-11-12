import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import {
  stripesConnect,
  IfPermission,
} from '@folio/stripes/core';

import {
  invoiceResource,
} from '../../../../common/resources';
import ApproveWithPayInvoiceAction from './ApproveWithPayInvoiceAction';

const ApproveWithPayInvoiceActionContainer = ({ mutator, invoice }) => {
  const saveInvoice = useCallback(
    updatedInvocie => (
      mutator.invoiceApproveWithPay.PUT(updatedInvocie)
        .then(() => mutator.invoiceApproveWithPay.GET())
    ),
    [mutator.invoiceApproveWithPay],
  );

  return (
    <IfPermission perm="invoice.item.approve,invoice.item.pay">
      <ApproveWithPayInvoiceAction
        invoice={invoice}
        saveInvoice={saveInvoice}
      />
    </IfPermission>
  );
};

ApproveWithPayInvoiceActionContainer.manifest = Object.freeze({
  invoiceApproveWithPay: {
    ...invoiceResource,
    fetch: false,
    accumulate: true,
  },
});

ApproveWithPayInvoiceActionContainer.propTypes = {
  mutator: PropTypes.object.isRequired,
  invoice: PropTypes.object.isRequired,
};

export default withRouter(stripesConnect(ApproveWithPayInvoiceActionContainer));
