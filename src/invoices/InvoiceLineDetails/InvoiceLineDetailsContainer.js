import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';

import { LoadingPane } from '@folio/stripes/components';
import {
  baseManifest,
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
  mutator: originMutator,
}) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const mutator = useMemo(() => originMutator, []);
  const [polNumber, setPolNumber] = useState('');
  const [invoice, setInvoice] = useState({});
  const [invoiceLine, setInvoiceLine] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isTagsPaneOpened, setTagsPaneOpened] = useModalToggle();
  const showCallout = useShowCallout();

  const fetchInvoiceLineDetails = useCallback(
    () => {
      const invoicePromies = mutator.invoice.GET().then(response => setInvoice(response));
      const invoiceLinePromise = mutator.invoiceLine.GET()
        .then(line => {
          setInvoiceLine(line);

          return line.poLineId && mutator.poLine.GET({ path: `${PO_LINES_API}/${line.poLineId}` });
        })
        .then(poLine => setPolNumber(poLine?.poLineNumber || ''));

      return Promise.all([invoicePromies, invoiceLinePromise]);
    },
    [mutator.invoice, mutator.invoiceLine, mutator.poLine],
  );

  useEffect(() => {
    setIsLoading(true);
    fetchInvoiceLineDetails().finally(setIsLoading);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const updateInvoiceLineTagList = async (line) => {
    setIsLoading(true);
    await mutator.invoiceLine.PUT(line);
    await fetchInvoiceLineDetails();
    setIsLoading(false);
  };

  const closeInvoiceLine = useCallback(
    () => {
      const pathname = `/invoice/view/${params.id}`;

      history.push({
        pathname,
        search: location.search,
      });
    },
    [params.id, history, location.search],
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
    () => {
      setIsLoading(true);
      mutator.invoiceLine.DELETE({ id: params.lineId }, { silent: true })
        .then(() => {
          showCallout({ messageId: 'ui-invoice.invoiceLine.hasBeenDeleted' });
          history.replace({
            pathname: `/invoice/view/${params.id}`,
            search: location.search,
          });
        })
        .catch(() => {
          setIsLoading(false);
          showCallout({ messageId: 'ui-invoice.errors.invoiceLineHasNotBeenDeleted', type: 'error' });
        });
    },
    [mutator.invoiceLine, params.lineId, params.id, showCallout, history, location.search],
  );

  if (isLoading || invoiceLine?.id !== params.lineId) {
    return (
      <LoadingPane dismissible onClose={closeInvoiceLine} />
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
