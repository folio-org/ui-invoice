import React, { useCallback } from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';

import { LoadingPane } from '@folio/stripes/components';
import {
  Tags,
  useModalToggle,
  useOrderLine,
  useShowCallout,
} from '@folio/stripes-acq-components';

import {
  useInvoice,
  useInvoiceLine,
  useInvoiceLineMutation,
  useVendors,
} from '../../common/hooks';
import InvoiceLineDetails from './InvoiceLineDetails';

const InvoiceLineDetailsContainer = ({
  history,
  location,
  match: { params },
}) => {
  const [isTagsPaneOpened, setTagsPaneOpened] = useModalToggle();
  const showCallout = useShowCallout();

  const { invoice, isLoading: isInvoiceLoading } = useInvoice(params?.id);
  const {
    invoiceLine,
    isLoading: isInvoiceLineLoading,
    refetch,
  } = useInvoiceLine(params?.lineId);
  const {
    orderLine: poLine,
    isLoading: isOrderLineLoading,
  } = useOrderLine(invoiceLine?.poLineId);
  const { vendors, isLoading: isVendorLoading } = useVendors([invoice?.vendorId]);

  const { mutateInvoiceLine } = useInvoiceLineMutation();

  const updateInvoiceLineTagList = (line) => mutateInvoiceLine({ data: line }).then(refetch);

  const closeInvoiceLine = useCallback(
    () => {
      const pathname = `/invoice/view/${params.id}`;

      history.push({
        pathname,
        search: location.search,
        state: location.state,
      });
    },
    [params.id, history, location.search, location.state],
  );

  const goToEditInvoiceLine = useCallback(
    () => {
      const pathname = `/invoice/view/${params.id}/line/${params.lineId}/edit`;

      history.push({
        pathname,
        search: location.search,
      });
    },
    [params.id, params.lineId, history, location.search],
  );

  const deleteInvoiceLine = useCallback(
    () => (
      mutateInvoiceLine({
        data: { id: params.lineId },
        options: { method: 'delete' },
      })
        .then(() => {
          showCallout({ messageId: 'ui-invoice.invoiceLine.hasBeenDeleted' });
          history.replace({
            pathname: `/invoice/view/${params.id}`,
            search: location.search,
          });
        })
        .catch(() => {
          showCallout({ messageId: 'ui-invoice.errors.invoiceLineHasNotBeenDeleted', type: 'error' });
        })
    ),
    [mutateInvoiceLine, params.lineId, params.id, showCallout, history, location.search],
  );

  if (
    isInvoiceLoading ||
    isInvoiceLineLoading ||
    isOrderLineLoading ||
    isVendorLoading
  ) {
    return (
      <LoadingPane dismissible onClose={closeInvoiceLine} />
    );
  }
  const {
    currency,
    exchangeRate,
    status,
    vendorInvoiceNo,
  } = invoice;

  return (
    <>
      <InvoiceLineDetails
        closeInvoiceLine={closeInvoiceLine}
        currency={currency}
        exchangeRate={exchangeRate}
        deleteInvoiceLine={deleteInvoiceLine}
        goToEditInvoiceLine={goToEditInvoiceLine}
        invoiceStatus={status}
        invoiceLine={invoiceLine}
        poLine={poLine}
        tagsToggle={setTagsPaneOpened}
        vendorInvoiceNo={vendorInvoiceNo}
        vendorCode={vendors?.[0]?.code}
      />
      {isTagsPaneOpened && (
        <Tags
          putMutator={updateInvoiceLineTagList}
          recordObj={invoiceLine}
          onClose={setTagsPaneOpened}
        />
      )}
    </>
  );
};

InvoiceLineDetailsContainer.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
};

export default InvoiceLineDetailsContainer;
