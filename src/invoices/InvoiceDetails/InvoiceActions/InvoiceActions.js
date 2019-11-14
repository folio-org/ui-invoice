import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import {
  isPayable,
  IS_EDIT_POST_APPROVAL,
} from '../../../common/utils';

import PayInvoiceAction from './PayInvoiceAction';
import ApproveInvoiceAction from './ApproveInvoiceAction';
import ApproveWithPayInvoiceAction from './ApproveWithPayInvoiceAction';

const InvoiceActions = ({ invoice, invoiceLinesCount, isApprovePayEnabled }) => {
  return (
    <Fragment>
      {
        !isApprovePayEnabled && invoiceLinesCount > 0 && isPayable(invoice.status) && (
          <PayInvoiceAction invoice={invoice} />
        )
      }

      {
        !isApprovePayEnabled && invoiceLinesCount > 0 && !IS_EDIT_POST_APPROVAL(invoice.id, invoice.status) && (
          <ApproveInvoiceAction invoice={invoice} />
        )
      }

      {
        isApprovePayEnabled
        && invoiceLinesCount > 0
        && (!IS_EDIT_POST_APPROVAL(invoice.id, invoice.status) || isPayable(invoice.status))
        && (
          <ApproveWithPayInvoiceAction invoice={invoice} />
        )
      }
    </Fragment>
  );
};

InvoiceActions.propTypes = {
  invoice: PropTypes.object.isRequired,
  invoiceLinesCount: PropTypes.number,
  isApprovePayEnabled: PropTypes.bool,
};

InvoiceActions.defaultProps = {
  invoiceLinesCount: 0,
  isApprovePayEnabled: false,
};

export default InvoiceActions;
