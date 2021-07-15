import React, { useCallback } from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';
import { withRouter } from 'react-router-dom';

import { useShowCallout } from '@folio/stripes-acq-components';

import { InvoiceLineFormContainer } from '../InvoiceLineForm';

export const EditInvoiceLine = ({ match, history, location }) => {
  const showCallout = useShowCallout();

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
    <InvoiceLineFormContainer
      onClose={closeForm}
      showCallout={showCallout}
    />
  );
};

EditInvoiceLine.propTypes = {
  location: ReactRouterPropTypes.location.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
};

export default withRouter(EditInvoiceLine);
