import {
  get,
  omit,
} from 'lodash';
import PropTypes from 'prop-types';
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';

import { LoadingPane } from '@folio/stripes/components';
import {
  stripesConnect,
  useOkapiKy,
} from '@folio/stripes/core';
import {
  baseManifest,
  batchFetch,
  LIMIT_MAX,
  INVOICES_API,
  orderLinesResource,
  useFiscalYears,
  useShowCallout,
  VENDORS_API,
} from '@folio/stripes-acq-components';

import {
  batchVoucherExportsResource,
  configApprovals,
  exportConfigsResource,
  invoiceLinesResource,
  invoiceResource,
  ordersResource,
} from '../../common/resources';
import {
  INVOICE_STATUS,
} from '../../common/constants';
import {
  useInvoiceLineMutation,
  useInvoiceMutation,
} from '../../common/hooks';
import { useInvoiceOrderStatusValidator } from './hooks/useInvoiceOrderStatusValidator';
import { INVOICE_OMITTED_FIELDS } from './constants';
import InvoiceDetails from './InvoiceDetails';
import {
  createInvoiceLineFromPOL,
  handleInvoiceLinesCreation,
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
  const mutator = useMemo(() => originMutator, [id]);
  const showCallout = useShowCallout();
  const ky = useOkapiKy();
  const [isLoading, setIsLoading] = useState(true);
  const [invoice, setInvoice] = useState({});
  const [invoiceLines, setInvoiceLines] = useState({});
  const [orderlinesMap, setOrderlinesMap] = useState();
  const [orders, setOrders] = useState([]);
  const [vendor, setVendor] = useState({});
  const [isApprovePayEnabled, setIsApprovePayEnabled] = useState(false);
  const [batchVoucherExport, setBatchVoucherExport] = useState();
  const [exportFormat, setExportFormat] = useState();

  const { fiscalYears } = useFiscalYears();
  const { mutateInvoice, deleteInvoice } = useInvoiceMutation();
  const { createInvoiceLines } = useInvoiceLineMutation();
  const shouldUpdateOrderStatus = useInvoiceOrderStatusValidator({
    fiscalYears,
    invoice,
    invoiceLines,
    orders,
  });

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

          return batchFetch(mutator.orders, poLinesResponse.map(({ purchaseOrderId }) => purchaseOrderId));
        })
        .then((ordersResponse) => {
          setOrders(ordersResponse);
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
      mutator.orders,
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

      try {
        await poLines.reduce((acc, poLine) => {
          return acc.then(() => mutator.invoiceLines.POST(createInvoiceLineFromPOL(poLine, id, vendor)));
        }, Promise.resolve());
        await fetchInvoiceData();
      } catch (response) {
        showUpdateInvoiceError({
          response,
          showCallout,
          action: 'saveLine',
          defaultErrorMessageId: 'ui-invoice.invoice.actions.saveLine.error',
          expenseClassMutator: mutator.expenseClass,
          fundMutator: mutator.fund,
          ky,
        });
      }

      setIsLoading(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fetchInvoiceData, id, mutator.invoiceLines, showCallout, vendor],
  );

  const onDeleteInvoice = useCallback(
    () => {
      setIsLoading(true);

      return deleteInvoice(id)
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
    [deleteInvoice, history, id, location.search, refreshList, showCallout],
  );

  const cancelInvoice = useCallback(
    ({ cancellationNote, polineStatus }) => {
      const canceledInvoice = { ...invoice, status: INVOICE_STATUS.cancelled, cancellationNote };
      const searchParams = polineStatus ? { poLinePaymentStatus: polineStatus } : {};

      setIsLoading(true);

      return mutateInvoice({ invoice: canceledInvoice, searchParams })
        .then(() => {
          showCallout({ messageId: 'ui-invoice.invoice.actions.cancel.success' });
          refreshList();

          return fetchInvoiceData();
        }, ({ response }) => (
          showUpdateInvoiceError({
            response,
            showCallout,
            action: 'cancel',
            defaultErrorMessageId: 'ui-invoice.invoice.actions.cancel.error',
            expenseClassMutator: mutator.expenseClass,
            fundMutator: mutator.fund,
            ky,
          })
        ))
        .finally(setIsLoading);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fetchInvoiceData, invoice, mutator.expenseClass, mutator.invoice, mutateInvoice, refreshList, showCallout],
  );

  const approveInvoice = useCallback(
    () => {
      const approvedInvoice = { ...invoice, status: INVOICE_STATUS.approved };

      setIsLoading(true);

      return mutateInvoice({ invoice: approvedInvoice })
        .then(() => {
          showCallout({ messageId: 'ui-invoice.invoice.actions.approve.success' });
          refreshList();

          return fetchInvoiceData();
        }, ({ response }) => (
          showUpdateInvoiceError({
            response,
            showCallout,
            action: 'approve',
            defaultErrorMessageId: 'ui-invoice.invoice.actions.approve.error',
            expenseClassMutator: mutator.expenseClass,
            fundMutator: mutator.fund,
            ky,
          })
        ))
        .finally(setIsLoading);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fetchInvoiceData, invoice, mutator.expenseClass, mutateInvoice, refreshList, showCallout],
  );

  const payInvoice = useCallback((polineStatus) => {
    const searchParams = polineStatus ? { poLinePaymentStatus: polineStatus } : {};
    const paidInvoice = { ...invoice, status: INVOICE_STATUS.paid };

    setIsLoading(true);

    return mutateInvoice({ invoice: paidInvoice, searchParams })
      .then(() => {
        showCallout({ messageId: 'ui-invoice.invoice.actions.pay.success' });
        refreshList();

        return fetchInvoiceData();
      }, ({ response }) => showUpdateInvoiceError({
        response,
        showCallout,
        action: 'pay',
        defaultErrorMessageId: 'ui-invoice.invoice.actions.pay.error',
        expenseClassMutator: mutator.expenseClass,
        fundMutator: mutator.fund,
        ky,
      }))
      .finally(setIsLoading);
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [fetchInvoiceData, invoice, mutator.expenseClass, mutateInvoice, refreshList, showCallout]);

  const approveAndPayInvoice = useCallback((polineStatus) => {
    setIsLoading(true);
    const searchParams = polineStatus ? { poLinePaymentStatus: polineStatus } : {};

    return mutateInvoice({ invoice: { ...invoice, status: INVOICE_STATUS.approved }, searchParams })
      .then(() => mutator.invoice.GET({ path: `${INVOICES_API}/${invoice.id}` }))
      .then(invoiceResponse => {
        return mutateInvoice({ invoice: { ...invoiceResponse, status: INVOICE_STATUS.paid }, searchParams });
      })
      .catch(({ response }) => {
        showUpdateInvoiceError({
          response,
          showCallout,
          action: 'approveAndPay',
          defaultErrorMessageId: 'ui-invoice.invoice.actions.approveAndPay.error',
          expenseClassMutator: mutator.expenseClass,
          fundMutator: mutator.fund,
          ky,
        });

        throw new Error('approveAndPay error');
      })
      .then(() => {
        showCallout({ messageId: 'ui-invoice.invoice.actions.approveAndPay.success' });
        refreshList();

        return fetchInvoiceData();
      })
      .finally(setIsLoading);
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [fetchInvoiceData, invoice, mutateInvoice, mutator.expenseClass, mutator.invoice, refreshList, showCallout]);

  const onDuplicateInvoice = useCallback(() => {
    setIsLoading(true);

    const currentInvoice = omit(invoice, INVOICE_OMITTED_FIELDS);
    const duplicateInvoice = {
      ...currentInvoice,
      status: INVOICE_STATUS.open,
    };

    return mutateInvoice({ invoice: duplicateInvoice })
      .then(({ id: newInvoiceId }) => handleInvoiceLinesCreation({
        invoiceLines: invoiceLines.invoiceLines,
        invoiceId: newInvoiceId,
        createInvoiceLines,
        mutator: {
          expenseClass: mutator.expenseClass,
          fund: mutator.fund,
        },
        showCallout,
        ky,
      })).then(async ({ invoiceId: newInvoiceId }) => {
        showCallout({ messageId: 'ui-invoice.invoice.actions.duplicate.success.message' });
        refreshList();

        return history.push({
          pathname: `/invoice/view/${newInvoiceId}`,
          search: location.search,
        });
      })
      .catch((error) => {
        showUpdateInvoiceError({
          response: error?.response,
          showCallout,
          action: 'duplicate',
          defaultErrorMessageId: 'ui-invoice.invoice.actions.duplicate.error.message',
          expenseClassMutator: mutator.expenseClass,
          fundMutator: mutator.fund,
          ky,
        });
      })
      .finally(() => setIsLoading(false));
  }, [
    invoice,
    mutateInvoice,
    mutator.expenseClass,
    mutator.fund,
    invoiceLines?.invoiceLines,
    createInvoiceLines,
    showCallout,
    refreshList,
    history,
    location.search,
    ky,
  ]);

  const updateInvoice = useCallback(
    (data) => {
      return mutateInvoice({ invoice: data })
        .then(() => mutator.invoice.GET())
        .then(setInvoice);
    },
    [mutateInvoice, mutator.invoice],
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
      cancelInvoice={cancelInvoice}
      createLine={createLine}
      deleteInvoice={onDeleteInvoice}
      onDuplicateInvoice={onDuplicateInvoice}
      invoice={invoice}
      invoiceLines={invoiceLines.invoiceLines}
      invoiceTotalUnits={invoiceTotalUnits}
      vendor={vendor}
      isApprovePayEnabled={isApprovePayEnabled}
      shouldUpdateOrderStatus={shouldUpdateOrderStatus}
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
  orders: ordersResource,
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
