import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import ReactRouterPropTypes from 'react-router-prop-types';

import { LoadingPane } from '@folio/stripes/components';
import { stripesConnect } from '@folio/stripes/core';
import {
  baseManifest,
  batchFetch,
  LIMIT_MAX,
  INVOICES_API,
  orderLinesResource,
  useShowCallout,
  VENDORS_API,
} from '@folio/stripes-acq-components';

import {
  batchVoucherExportsResource,
  configApprovals,
  exportConfigsResource,
  invoiceLinesResource,
  invoiceResource,
} from '../../common/resources';
import {
  INVOICE_STATUS,
} from '../../common/constants';
import {
  useInvoiceMutation,
} from '../../common/hooks';
import InvoiceDetails from './InvoiceDetails';
import {
  createInvoiceLineFromPOL,
  showUpdateInvoiceError,
} from './utils';

export function InvoiceDetailsContainer({
  match: { url },
  match: { params: { id } },
  history,
  mutator: originMutator,
  location,
  refreshList,
}) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const mutator = useMemo(() => originMutator, []);
  const showCallout = useShowCallout();
  const [isLoading, setIsLoading] = useState(true);
  const [invoice, setInvoice] = useState({});
  const [invoiceLines, setInvoiceLines] = useState({});
  const [orderlinesMap, setOrderlinesMap] = useState();
  const [vendor, setVendor] = useState({});
  const [isApprovePayEnabled, setIsApprovePayEnabled] = useState(false);
  const [batchVoucherExport, setBatchVoucherExport] = useState();
  const [exportFormat, setExportFormat] = useState();

  const { mutateInvoice } = useInvoiceMutation();

  const fetchInvoiceData = useCallback(
    () => {
      setInvoice({});
      setInvoiceLines({});
      setVendor({});
      setBatchVoucherExport();
      setExportFormat();

      return mutator.invoice.GET({ path: `${INVOICES_API}/${id}` })
        .then(invoiceResponse => {
          setInvoice(invoiceResponse);

          const vendorPromise = mutator.vendor.GET({
            path: `${VENDORS_API}/${invoiceResponse.vendorId}`,
          });
          const invoiceLinesPromise = mutator.invoiceLines.GET({
            params: {
              limit: `${LIMIT_MAX}`,
              query: `(invoiceId==${id}) sortBy metadata.createdDate invoiceLineNumber`,
            },
          });
          const approvalsConfigPromise = mutator.invoiceActionsApprovals.GET();
          const exportConfigsPromise = mutator.exportConfigs.GET({
            params: {
              limit: `${LIMIT_MAX}`,
              query: `batchGroupId==${invoiceResponse.batchGroupId}`,
            },
          });

          return Promise.all([
            vendorPromise,
            invoiceLinesPromise,
            approvalsConfigPromise,
            exportConfigsPromise,
            invoiceResponse.folioInvoiceNo,
          ]);
        })
        .then(([
          vendorResp,
          invoiceLinesResp,
          approvalsConfigResp,
          exportConfigsResp,
          folioInvoiceNo,
        ]) => {
          setVendor(vendorResp);
          setInvoiceLines(invoiceLinesResp);
          setExportFormat(exportConfigsResp[0]?.format);

          let approvalsConfig;

          try {
            approvalsConfig = JSON.parse(get(approvalsConfigResp, [0, 'value'], '{}'));
          } catch (e) {
            approvalsConfig = {};
          }

          setIsApprovePayEnabled(approvalsConfig.isApprovePayEnabled || false);

          const batchVoucherExportPromise = exportConfigsResp[0]?.id
            ? mutator.batchVoucherExport.GET({
              params: {
                limit: `${LIMIT_MAX}`,
                query: `batchVouchers.batchedVouchers=folioInvoiceNo:${folioInvoiceNo}`,
              },
            })
            : Promise.resolve([]);

          const poLineIdsToRequest = invoiceLinesResp.invoiceLines?.reduce((poLineIds, { poLineId }) => {
            if (poLineId) {
              poLineIds.push(poLineId);
            }

            return poLineIds;
          }, []);

          const poLinesPromise = batchFetch(mutator.orderLines, poLineIdsToRequest);

          return Promise.all([batchVoucherExportPromise, poLinesPromise]);
        })
        .then(([batchVoucherExportResp, poLinesResponse]) => {
          setBatchVoucherExport(batchVoucherExportResp[0]);
          setOrderlinesMap(poLinesResponse.reduce((acc, poLine) => {
            acc[poLine.id] = poLine;

            return acc;
          }, {}));
        })
        .catch(() => {
          showCallout({ messageId: 'ui-invoice.invoice.actions.load.error', type: 'error' });
        });
    },
    [
      id,
      mutator.invoice,
      mutator.invoiceActionsApprovals,
      mutator.invoiceLines,
      mutator.orderLines,
      mutator.vendor,
      mutator.batchVoucherExport,
      mutator.exportConfigs,
      showCallout,
    ],
  );

  useEffect(
    () => {
      setIsLoading(true);
      fetchInvoiceData().finally(setIsLoading);
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
    [history, location.search],
  );

  const onEdit = useCallback(
    () => {
      history.push({
        pathname: `/invoice/edit/${id}`,
        search: location.search,
      });
    },
    [history, id, location.search],
  );

  const createLine = useCallback(
    () => {
      history.push({
        pathname: `${url}/line/create`,
        search: location.search,
      });
    },
    [history, url, location.search],
  );

  const addLines = useCallback(
    async (poLines) => {
      setIsLoading(true);
      await poLines.map(
        poLine => mutator.invoiceLines.POST(createInvoiceLineFromPOL(poLine, id, vendor)),
      );
      await fetchInvoiceData();
      setIsLoading(false);
    },
    [fetchInvoiceData, id, mutator.invoiceLines, vendor],
  );

  const deleteInvoice = useCallback(
    () => {
      setIsLoading(true);

      return mutator.invoice.DELETE({ id }, { silent: true })
        .then(() => {
          showCallout({ messageId: 'ui-invoice.invoice.invoiceHasBeenDeleted' });
          refreshList();
          history.replace({
            pathname: '/invoice',
            search: location.search,
          });
        }, async (response) => {
          setIsLoading(false);
          showCallout({ messageId: 'ui-invoice.errors.invoiceHasNotBeenDeleted', type: 'error' });
          try {
            const { errors } = await response.json();
            const message = errors[0].message;

            if (message) showCallout({ message, type: 'error' });
            // eslint-disable-next-line no-empty
          } catch (e) { }
        });
    },
    [history, id, location.search, mutator.invoice, refreshList, showCallout],
  );

  const cancelInvoice = useCallback(
    (cancellationNote) => {
      const canceledInvoice = { ...invoice, status: INVOICE_STATUS.cancelled, cancellationNote };

      setIsLoading(true);

      return mutateInvoice(canceledInvoice)
        .then(() => {
          showCallout({ messageId: 'ui-invoice.invoice.actions.cancel.success' });
          refreshList();

          return fetchInvoiceData();
        }, ({ response }) => (
          showUpdateInvoiceError(
            response,
            showCallout,
            'cancel',
            'ui-invoice.invoice.actions.cancel.error',
            mutator.expenseClass,
            mutator.fund,
          )
        ))
        .finally(setIsLoading);
    },
    [fetchInvoiceData, invoice, mutator.expenseClass, mutator.invoice, mutateInvoice, refreshList, showCallout],
  );

  const approveInvoice = useCallback(
    () => {
      const approvedInvoice = { ...invoice, status: INVOICE_STATUS.approved };

      setIsLoading(true);

      return mutateInvoice(approvedInvoice)
        .then(() => {
          showCallout({ messageId: 'ui-invoice.invoice.actions.approve.success' });
          refreshList();

          return fetchInvoiceData();
        }, ({ response }) => (
          showUpdateInvoiceError(
            response,
            showCallout,
            'approve',
            'ui-invoice.invoice.actions.approve.error',
            mutator.expenseClass,
            mutator.fund,
          )
        ))
        .finally(setIsLoading);
    },
    [fetchInvoiceData, invoice, mutator.expenseClass, mutateInvoice, refreshList, showCallout],
  );

  const payInvoice = useCallback(
    () => {
      const paidInvoice = { ...invoice, status: INVOICE_STATUS.paid };

      setIsLoading(true);

      return mutateInvoice(paidInvoice)
        .then(() => {
          showCallout({ messageId: 'ui-invoice.invoice.actions.pay.success' });
          refreshList();

          return fetchInvoiceData();
        }, ({ response }) => showUpdateInvoiceError(
          response,
          showCallout,
          'pay',
          'ui-invoice.invoice.actions.pay.error',
          mutator.expenseClass,
          mutator.fund,
        ))
        .finally(setIsLoading);
    },
    [fetchInvoiceData, invoice, mutator.expenseClass, mutateInvoice, refreshList, showCallout],
  );

  const approveAndPayInvoice = useCallback(
    () => {
      setIsLoading(true);

      return mutateInvoice({ ...invoice, status: INVOICE_STATUS.approved })
        .then(() => mutator.invoice.GET())
        .then(invoiceResponse => {
          return mutateInvoice({ ...invoiceResponse, status: INVOICE_STATUS.paid });
        })
        .catch(({ response }) => {
          showUpdateInvoiceError(
            response,
            showCallout,
            'approveAndPay',
            'ui-invoice.invoice.actions.approveAndPay.error',
            mutator.expenseClass,
            mutator.fund,
          );

          throw new Error('approveAndPay error');
        })
        .then(() => {
          showCallout({ messageId: 'ui-invoice.invoice.actions.approveAndPay.success' });
          refreshList();

          return fetchInvoiceData();
        })
        .finally(setIsLoading);
    },
    [fetchInvoiceData, invoice, mutateInvoice, mutator.expenseClass, mutator.invoice, refreshList, showCallout],
  );

  const updateInvoice = useCallback(
    (data) => {
      mutator.invoice.PUT(data)
        .then(() => mutator.invoice.GET())
        .then(setInvoice);
    },
    [mutator.invoice],
  );

  const invoiceTotalUnits = get(invoiceLines, 'invoiceLines', []).reduce((total, line) => (
    total + +line.quantity
  ), 0);

  if (isLoading || invoice?.id !== id) {
    return (
      <LoadingPane
        id="pane-invoiceDetails"
        dismissible
        onClose={closePane}
      />
    );
  }

  return (
    <InvoiceDetails
      addLines={addLines}
      approveAndPayInvoice={approveAndPayInvoice}
      approveInvoice={approveInvoice}
      createLine={createLine}
      deleteInvoice={deleteInvoice}
      cancelInvoice={cancelInvoice}
      invoice={invoice}
      invoiceLines={invoiceLines.invoiceLines}
      invoiceTotalUnits={invoiceTotalUnits}
      vendor={vendor}
      isApprovePayEnabled={isApprovePayEnabled}
      onClose={closePane}
      onEdit={onEdit}
      onUpdate={updateInvoice}
      orderlinesMap={orderlinesMap}
      payInvoice={payInvoice}
      totalInvoiceLines={invoiceLines.totalRecords}
      batchVoucherExport={batchVoucherExport}
      exportFormat={exportFormat}
      refreshData={fetchInvoiceData}
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
  orderLines: {
    ...orderLinesResource,
    accumulate: true,
    fetch: false,
  },
  vendor: {
    ...baseManifest,
    accumulate: true,
    fetch: false,
  },
  exportConfigs: exportConfigsResource,
  batchVoucherExport: batchVoucherExportsResource,
  expenseClass: {
    ...baseManifest,
    accumulate: true,
    fetch: false,
  },
  fund: {
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
  refreshList: PropTypes.func.isRequired,
};

export default stripesConnect(InvoiceDetailsContainer);
