import React, { Fragment, useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';

import {
  baseManifest,
  LoadingPane,
  Tags,
  useModalToggle,
} from '@folio/stripes-acq-components';

import {
  invoiceLineResource,
  invoiceResource,
} from '../../../common/resources';
import { PO_LINES_API } from '../../../common/constants';
import InvoiceLineDetails from '../../InvoiceLineDetails';

const InvoiceLineDetailsLayer = ({
  history,
  match: { params },
  mutator,
  showToast,
}) => {
  const [polNumber, setPolNumber] = useState('');
  const [invoice, setInvoice] = useState({});
  const [invoiceLine, setInvoiceLine] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isTagsPaneOpened, setTagsPaneOpened] = useModalToggle();

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
      const path = `/invoice/view/${params.id}`;

      history.push(path);
    },
    [params.id, history],
  );

  const goToEditInvoiceLine = useCallback(
    () => {
      const path = `/invoice/view/${params.id}/line/${params.lineId}/edit`;

      history.push(path);
    },
    [params.id, params.lineId, history],
  );

  const deleteInvoiceLine = useCallback(
    () => {
      mutator.invoiceLine.DELETE({ id: params.lineId })
        .then(() => {
          showToast('ui-invoice.invoiceLine.hasBeenDeleted');
          closeInvoiceLine();
        })
        .catch(() => {
          showToast('ui-invoice.errors.invoiceLineHasNotBeenDeleted', 'error');
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
    <Fragment>
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
    </Fragment>
  );
};

InvoiceLineDetailsLayer.manifest = Object.freeze({
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

InvoiceLineDetailsLayer.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  mutator: PropTypes.object.isRequired,
  showToast: PropTypes.func.isRequired,
};

export default InvoiceLineDetailsLayer;
