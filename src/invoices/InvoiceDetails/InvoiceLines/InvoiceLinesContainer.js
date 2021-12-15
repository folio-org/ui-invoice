import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';

import {
  useInvoiceOrders,
} from './hooks';
import InvoiceLines from './InvoiceLines';

export const InvoiceLinesContainerComponent = ({
  invoiceLines,
  invoice,
  vendor,
  history,
  location,
  orderlinesMap,
  refreshData,
  visibleColumns,
}) => {
  const { orders } = useInvoiceOrders(invoice);

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
      invoice={invoice}
      vendor={vendor}
      orders={orders}
      invoiceLinesItems={invoiceLines}
      openLineDetails={openLineDetails}
      orderlinesMap={orderlinesMap}
      refreshData={refreshData}
      visibleColumns={visibleColumns}
    />
  );
};

InvoiceLinesContainerComponent.propTypes = {
  invoice: PropTypes.object.isRequired,
  vendor: PropTypes.object.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  invoiceLines: PropTypes.arrayOf(PropTypes.object),
  orderlinesMap: PropTypes.object,
  refreshData: PropTypes.func.isRequired,
  visibleColumns: PropTypes.arrayOf(PropTypes.string),
};

InvoiceLinesContainerComponent.defaultProps = {
  invoiceLines: [],
};

export default withRouter(InvoiceLinesContainerComponent);
