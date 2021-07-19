import React, { useCallback } from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';
import { withRouter } from 'react-router-dom';

import { InvoiceFormContainer } from '../InvoiceForm';

export const EditInvoice = ({ history, location, match }) => {
  const invoiceId = match.params.id;

  const closeForm = useCallback(
    () => {
      history.push({
        pathname: `/invoice/view/${invoiceId}`,
        search: location.search,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [invoiceId, location.search],
  );

  return (
    <InvoiceFormContainer
      onCancel={closeForm}
    />
  );
};

EditInvoice.propTypes = {
  location: ReactRouterPropTypes.location.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
};

export default withRouter(EditInvoice);
