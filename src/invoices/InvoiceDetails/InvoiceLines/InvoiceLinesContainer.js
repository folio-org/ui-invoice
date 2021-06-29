import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';

import InvoiceLines from './InvoiceLines';

const InvoiceLinesContainer = ({
  invoiceLines,
  invoice,
  vendor,
  history,
  location,
  orderlinesMap,
  refreshData,
}) => {
  const openLineDetails = useCallback(
    (e, invoiceLine) => {
      if (e.target.attributes?.role?.value !== 'gridcell') {
        return;
      }

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
      invoice={invoice}
      vendor={vendor}
      invoiceLinesItems={invoiceLines}
      openLineDetails={openLineDetails}
      orderlinesMap={orderlinesMap}
      refreshData={refreshData}
    />
  );
};

InvoiceLinesContainer.propTypes = {
  invoice: PropTypes.object.isRequired,
  vendor: PropTypes.object.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  invoiceLines: PropTypes.arrayOf(PropTypes.object),
  orderlinesMap: PropTypes.object,
  refreshData: PropTypes.func.isRequired,
};

InvoiceLinesContainer.defaultProps = {
  invoiceLines: [],
};

export default withRouter(InvoiceLinesContainer);
