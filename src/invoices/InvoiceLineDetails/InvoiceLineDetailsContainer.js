import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';

import {
  baseManifest,
  LoadingPane,
  Tags,
  useModalToggle,
  useShowCallout,
} from '@folio/stripes-acq-components';
import { stripesConnect } from '@folio/stripes/core';

import {
  invoiceLineResource,
  invoiceResource,
} from '../../common/resources';
import { PO_LINES_API } from '../../common/constants';
import InvoiceLineDetails from './InvoiceLineDetails';

const InvoiceLineDetailsContainer = ({
  history,
  location,
  match: { params },
  mutator,
}) => {
  const [polNumber, setPolNumber] = useState('');
  const [invoice, setInvoice] = useState({});
  const [invoiceLine, setInvoiceLine] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isTagsPaneOpened, setTagsPaneOpened] = useModalToggle();
  const showCallout = useShowCallout();

  const fetchInvoiceLineDetails = useCallback(
    () => {
      setIsLoading(true);
      mutator.invoice.GET().then(response => setInvoice(response));
      mutator.invoiceLine.GET()
        .then(line => {
          setInvoiceLine(line);
          if (line.poLineId) {
            mutator.poLine.GET({
              path: `${PO_LINES_API}/${line.poLineId}`,
            }).then(({ poLineNumber }) => setPolNumber(poLineNumber));
          }
          setIsLoading(false);
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [params.id],
  );

  useEffect(fetchInvoiceLineDetails, [params.id]);

  const updateInvoiceLineTagList = async (line) => {
    await mutator.invoiceLine.PUT(line);
    fetchInvoiceLineDetails();
  };

  const closeInvoiceLine = useCallback(
    () => {
      const pathname = `/invoice/view/${params.id}`;

      history.push({
        pathname,
        search: location.search,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [params.id, location.search],
  );

  const goToEditInvoiceLine = useCallback(
    () => {
      const pathname = `/invoice/view/${params.id}/line/${params.lineId}/edit`;

      history.push({
        pathname,
        search: location.search,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [params.id, params.lineId, location.search],
  );

  const deleteInvoiceLine = useCallback(
    () => {
      mutator.invoiceLine.DELETE({ id: params.lineId })
        .then(() => {
          showCallout({ messageId: 'ui-invoice.invoiceLine.hasBeenDeleted' });
          closeInvoiceLine();
        })
        .catch(() => {
          showCallout({ messageId: 'ui-invoice.errors.invoiceLineHasNotBeenDeleted', type: 'error' });
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [params.lineId],
  );

  if (isLoading) {
    return (
      <LoadingPane onClose={closeInvoiceLine} />
    );
  }

  return (
    <>
      <InvoiceLineDetails
        closeInvoiceLine={closeInvoiceLine}
        currency={invoice.currency}
        deleteInvoiceLine={deleteInvoiceLine}
        goToEditInvoiceLine={goToEditInvoiceLine}
        invoiceLine={invoiceLine}
        poLineNumber={polNumber}
        tagsToggle={setTagsPaneOpened}
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

InvoiceLineDetailsContainer.manifest = Object.freeze({
  invoiceLine: {
    ...invoiceLineResource,
    accumulate: true,
    fetch: false,
  },
  invoice: {
    ...invoiceResource,
    accumulate: true,
    fetch: false,
  },
  poLine: {
    ...baseManifest,
    path: PO_LINES_API,
    accumulate: true,
    fetch: false,
  },
});

InvoiceLineDetailsContainer.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  mutator: PropTypes.object.isRequired,
};

export default stripesConnect(InvoiceLineDetailsContainer);
