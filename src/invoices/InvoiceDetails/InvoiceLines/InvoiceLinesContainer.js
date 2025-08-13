import PropTypes from 'prop-types';
import { useCallback } from 'react';
import { withRouter } from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';

import { useInvoiceOrders } from './hooks';
import InvoiceLines from './InvoiceLines';

const DEFAULT_PROPS = {
  invoiceLines: [],
  orderlinesMap: {},
  visibleColumns: [],
};

export const InvoiceLinesContainerComponent = ({
  exchangedTotalsMap,
  history,
  invoice,
  invoiceLines = DEFAULT_PROPS.invoiceLines,
  location,
  orderlinesMap = DEFAULT_PROPS.orderlinesMap,
  refreshData,
  vendor,
  visibleColumns = DEFAULT_PROPS.visibleColumns,
}) => {
  const { orders } = useInvoiceOrders(invoice);

  const openLineDetails = useCallback(
    (e, invoiceLine) => {
      const pathname = `/invoice/view/${invoiceLine.invoiceId}/line/${invoiceLine.id}/view`;

      history.push({
        pathname,
        search: location.search,
        state: { id: invoiceLine.id },
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [location],
  );

  return (
    <InvoiceLines
      exchangedTotalsMap={exchangedTotalsMap}
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
  exchangedTotalsMap: PropTypes.instanceOf(Map).isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  invoice: PropTypes.object.isRequired,
  invoiceLines: PropTypes.arrayOf(PropTypes.object),
  location: ReactRouterPropTypes.location.isRequired,
  orderlinesMap: PropTypes.object,
  refreshData: PropTypes.func.isRequired,
  vendor: PropTypes.object.isRequired,
  visibleColumns: PropTypes.arrayOf(PropTypes.string),
};

export default withRouter(InvoiceLinesContainerComponent);
