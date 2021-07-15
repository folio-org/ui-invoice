import React, { useCallback } from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';
import { withRouter } from 'react-router-dom';

import { InvoiceFormContainer } from '../InvoiceForm';

export const CreateInvoice = ({ history, location }) => {
  const closeForm = useCallback(
    (id) => {
      history.push({
        pathname: id ? `/invoice/view/${id}` : '/invoice',
        search: location.search,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [location.search],
  );

  return (
    <InvoiceFormContainer
      onCancel={closeForm}
    />
  );
};

CreateInvoice.propTypes = {
  location: ReactRouterPropTypes.location.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
};

export default withRouter(CreateInvoice);
