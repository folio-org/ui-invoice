import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import ReactRouterPropTypes from 'react-router-prop-types';

import { stripesConnect } from '@folio/stripes/core';
import {
  baseManifest,
  LoadingPane,
  useShowCallout,
} from '@folio/stripes-acq-components';

import { getApproveErrorMessage } from '../../common/utils';
import {
  configApprovals,
  invoiceResource,
  invoiceLinesResource,
} from '../../common/resources';
import {
  INVOICE_STATUS,
  VENDORS_API,
} from '../../common/constants';
import InvoiceDetails from './InvoiceDetails';
import { createInvoiceLineFromPOL } from './utils';

function InvoiceDetailsContainer({
  match: { url },
  match: { params: { id } },
  history,
  mutator,
  location,
}) {
  const showCallout = useShowCallout();
  const [isLoading, setIsLoading] = useState(false);
  const [invoice, setInvoice] = useState({});
  const [invoiceLines, setInvoiceLines] = useState({});
  const [vendor, setVendor] = useState({});
  const [isApprovePayEnabled, setIsApprovePayEnabled] = useState(false);

  const fetchInvoiceData = useCallback(
    () => {
      setIsLoading(true);
      setInvoice({});
      setInvoiceLines({});
      setVendor({});

      mutator.invoice.GET()
        .then(invoiceResponse => {
          setInvoice(invoiceResponse);

          const vendorPromise = mutator.vendor.GET({
            path: `${VENDORS_API}/${invoiceResponse.vendorId}`,
          });
          const invoiceLinesPromise = mutator.invoiceLines.GET({
            params: {
              query: `(invoiceId==${invoiceResponse.id}) sortBy metadata.createdDate invoiceLineNumber`,
            },
          });
          const approvalsConfigPromise = mutator.invoiceActionsApprovals.GET();

          return Promise.all([vendorPromise, invoiceLinesPromise, approvalsConfigPromise]);
        })
        .then(([vendorResp, invoiceLinesResp, approvalsConfigResp]) => {
          setVendor(vendorResp);
          setInvoiceLines(invoiceLinesResp);

          let approvalsConfig;

          try {
            approvalsConfig = JSON.parse(get(approvalsConfigResp, [0, 'value'], '{}'));
          } catch (e) {
            approvalsConfig = {};
          }

          setIsApprovePayEnabled(approvalsConfig.isApprovePayEnabled || false);
        })
        .catch(() => {
          showCallout({ messageId: 'ui-invoice.invoice.actions.load.error', type: 'error' });
        })
        .finally(() => setIsLoading(false));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [id],
  );

  const closePane = useCallback(
    () => {
      history.push({
        pathname: '/invoice',
        search: location.search,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [location.search],
  );

  const onEdit = useCallback(
    () => {
      history.push({
        pathname: `/invoice/edit/${id}`,
        search: location.search,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [id, location.search],
  );

  useEffect(fetchInvoiceData, [id]);

  const createLine = useCallback(
    () => {
      history.push({
        pathname: `${url}/line/create`,
        search: location.search,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [url, location.search],
  );

  const addLines = useCallback(
    async (poLines) => {
      await poLines.map(
        poLine => mutator.invoiceLines.POST(createInvoiceLineFromPOL(poLine, id, vendor)),
      );
      fetchInvoiceData();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [id],
  );

  const deleteInvoice = useCallback(
    () => {
      mutator.invoice.DELETE({ id })
        .then(() => {
          showCallout({ messageId: 'ui-invoice.invoice.invoiceHasBeenDeleted' });
          closePane();
        })
        .catch(() => {
          showCallout({ messageId: 'ui-invoice.errors.invoiceHasNotBeenDeleted', type: 'error' });
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [id, closePane],
  );

  const approveInvoice = useCallback(
    () => {
      const approvedInvoice = { ...invoice, status: INVOICE_STATUS.approved };

      mutator.invoice.PUT(approvedInvoice)
        .then(setInvoice)
        .then(() => showCallout({ messageId: 'ui-invoice.invoice.actions.approve.success' }))
        .catch(async (response) => {
          try {
            const { errors } = await response.json();
            const errorCode = get(errors, [0, 'code']);

            showCallout({ messageId: getApproveErrorMessage(errorCode), type: 'error' });
          } catch (e) {
            showCallout({ messageId: 'ui-invoice.invoice.actions.approve.error', type: 'error' });
          }
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [invoice],
  );

  const payInvoice = useCallback(
    () => {
      const paidInvoice = { ...invoice, status: INVOICE_STATUS.paid };

      mutator.invoice.PUT(paidInvoice)
        .then(setInvoice)
        .then(() => showCallout({ messageId: 'ui-invoice.invoice.actions.pay.success' }))
        .catch(async (response) => {
          try {
            const { errors } = await response.json();
            const errorCode = get(errors, [0, 'code']);

            showCallout({
              messageId: getApproveErrorMessage(errorCode, 'ui-invoice.invoice.actions.pay.error'),
              type: 'error',
            });
          } catch (e) {
            showCallout({ messageId: 'ui-invoice.invoice.actions.pay.error', type: 'error' });
          }
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [invoice],
  );

  const approveAndPayInvoice = useCallback(
    () => {
      mutator.invoice.PUT({ ...invoice, status: INVOICE_STATUS.approved })
        .then(() => mutator.invoice.GET())
        .then(invoiceResponse => {
          mutator.invoice.PUT({ ...invoiceResponse, status: INVOICE_STATUS.paid });
        })
        .then(setInvoice)
        .then(() => showCallout({ messageId: 'ui-invoice.invoice.actions.approveAndPay.success' }))
        .catch(async (response) => {
          try {
            const { errors } = await response.json();
            const errorCode = get(errors, [0, 'code']);

            showCallout({
              messageId: getApproveErrorMessage(errorCode, 'ui-invoice.invoice.actions.approveAndPay.error'),
              type: 'error',
            });
          } catch (e) {
            showCallout({ messageId: 'ui-invoice.invoice.actions.approveAndPay.error', type: 'error' });
          }
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [invoice],
  );

  const updateInvoice = useCallback(
    (data) => {
      mutator.invoice.PUT(data)
        .then(() => mutator.invoice.GET())
        .then(setInvoice);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [id],
  );

  const invoiceTotalUnits = get(invoiceLines, 'invoiceLines', []).reduce((total, line) => (
    total + +line.quantity
  ), 0);

  if (isLoading) {
    return <LoadingPane onClose={closePane} />;
  }

  return (
    <InvoiceDetails
      addLines={addLines}
      approveAndPayInvoice={approveAndPayInvoice}
      approveInvoice={approveInvoice}
      createLine={createLine}
      deleteInvoice={deleteInvoice}
      invoice={invoice}
      invoiceLines={invoiceLines.invoiceLines}
      invoiceTotalUnits={invoiceTotalUnits}
      isApprovePayEnabled={isApprovePayEnabled}
      onClose={closePane}
      onEdit={onEdit}
      onUpdate={updateInvoice}
      payInvoice={payInvoice}
      totalInvoiceLines={invoiceLines.totalRecords}
    />
  );
}

InvoiceDetailsContainer.manifest = Object.freeze({
  invoice: {
    ...invoiceResource,
    accumulate: true,
    fetch: false,
  },
  invoiceLines: {
    ...invoiceLinesResource,
    accumulate: true,
    fetch: false,
  },
  invoiceActionsApprovals: configApprovals,
  vendor: {
    ...baseManifest,
    accumulate: true,
    fetch: false,
  },
});

InvoiceDetailsContainer.propTypes = {
  match: ReactRouterPropTypes.match,
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  mutator: PropTypes.object.isRequired,
};

export default stripesConnect(InvoiceDetailsContainer);
