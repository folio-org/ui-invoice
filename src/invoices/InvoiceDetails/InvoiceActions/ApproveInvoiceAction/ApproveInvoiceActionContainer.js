import React from 'react';
import PropTypes from 'prop-types';
import withRouter from 'react-router-dom/withRouter';

import {
  stripesConnect,
  IfPermission,
} from '@folio/stripes/core';

import {
  invoiceResource,
} from '../../../../common/resources';
import ApproveInvoiceAction from './ApproveInvoiceAction';

const ApproveInvoiceActionContainer = ({ mutator, invoice }) => {
  return (
    <IfPermission perm="invoice.item.approve">
      <ApproveInvoiceAction
        invoice={invoice}
        saveInvoice={mutator.invoiceApproval.PUT}
      />
    </IfPermission>
  );
};

ApproveInvoiceActionContainer.manifest = Object.freeze({
  invoiceApproval: {
    ...invoiceResource,
    fetch: false,
    accumulate: true,
  },
});

ApproveInvoiceActionContainer.propTypes = {
  mutator: PropTypes.object.isRequired,
  invoice: PropTypes.object.isRequired,
};

export default withRouter(stripesConnect(ApproveInvoiceActionContainer));
