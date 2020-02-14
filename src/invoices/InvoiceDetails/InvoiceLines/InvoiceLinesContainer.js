import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';

import InvoiceLines from './InvoiceLines';

const InvoiceLinesContainer = ({
  currency,
  invoiceLines,
  history,
}) => {
  const openLineDetails = useCallback(
    (e, invoiceLine) => {
      const path = `/invoice/view/${invoiceLine.invoiceId}/line/${invoiceLine.id}/view`;

      history.push(path);
    },
    [history],
  );

  return (
    <InvoiceLines
      currency={currency}
      invoiceLinesItems={invoiceLines}
      openLineDetails={openLineDetails}
    />
  );
};

InvoiceLinesContainer.propTypes = {
  currency: PropTypes.string.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  invoiceLines: PropTypes.arrayOf(PropTypes.object),
};

InvoiceLinesContainer.defaultProps = {
  invoiceLines: [],
};

export default withRouter(InvoiceLinesContainer);
