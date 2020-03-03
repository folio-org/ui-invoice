import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';

import InvoiceLines from './InvoiceLines';

const InvoiceLinesContainer = ({
  currency,
  invoiceLines,
  history,
  location,
}) => {
  const openLineDetails = useCallback(
    (e, invoiceLine) => {
      const pathname = `/invoice/view/${invoiceLine.invoiceId}/line/${invoiceLine.id}/view`;

      history.push({
        pathname,
        search: location.search,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [location],
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
  location: ReactRouterPropTypes.location.isRequired,
  invoiceLines: PropTypes.arrayOf(PropTypes.object),
};

InvoiceLinesContainer.defaultProps = {
  invoiceLines: [],
};

export default withRouter(InvoiceLinesContainer);
