import React from 'react';
import PropTypes from 'prop-types';
import withRouter from 'react-router-dom/withRouter';

import { stripesConnect } from '@folio/stripes/core';

import {
  invoiceResource,
} from '../../../../common/resources';
import ApproveInvoiceAction from './ApproveInvoiceAction';

const ApproveInvoiceActionContainer = ({ mutator, invoice }) => {
  return (
    <ApproveInvoiceAction
      invoice={invoice}
      saveInvoice={mutator.invoiceApproval.PUT}
    />
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
