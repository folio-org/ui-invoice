import get from 'lodash/get';
import moment from 'moment';
import PropTypes from 'prop-types';
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { withRouter } from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';

import {
  LoadingPane,
  Paneset,
} from '@folio/stripes/components';
import { stripesConnect } from '@folio/stripes/core';
import {
  baseManifest,
  DATE_FORMAT,
  LIMIT_MAX,
  sourceValues,
  useAddresses,
  useModalToggle,
  useOrganization,
  useShowCallout,
  VENDORS_API,
} from '@folio/stripes-acq-components';

import {
  INVOICE_STATUS,
  SUBMIT_ACTION,
  SUBMIT_ACTION_FIELD_NAME,
  VALIDATION_ERRORS,
} from '../../common/constants';
import {
  useAdjustmentsSettings,
  useBatchGroups,
  useInvoice,
  useInvoiceLineMutation,
  useOrderLines,
  useOrders,
} from '../../common/hooks';
import {
  invoiceDocumentsResource,
  invoiceResource,
  invoicesResource,
} from '../../common/resources';
import { NO_ACCOUNT_NUMBER } from '../../common/utils';
import { createInvoiceLineFromPOL } from '../InvoiceDetails/utils';
import DuplicateInvoiceModal from './DuplicateInvoiceModal';
import InvoiceForm from './InvoiceForm';
import {
  saveInvoice,
  getAlwaysShownAdjustmentsList,
} from './utils';

export function InvoiceFormContainerComponent({
  history,
  location,
  match,
  mutator,
  okapi,
  onCancel,
  resources,
  stripes,
}) {
  const showToast = useShowCallout();

  const [isNotUniqueOpen, toggleNotUnique] = useModalToggle();

  const [duplicateInvoices, setDuplicateInvoices] = useState();
  const [forceSaveValues, setForceSaveValues] = useState();

  const { params: { id } } = match;
  const isCreate = !id;
  const orderIds = location?.state?.orderIds;
  const isCreateFromOrder = Boolean(orderIds?.length);

  const { mutateInvoiceLine } = useInvoiceLineMutation({
    onSuccess: () => {
      return showToast({ messageId: 'ui-invoice.invoiceLine.hasBeenSaved' });
    },
    onError: () => {
      return showToast({ messageId: 'ui-invoice.errors.invoiceLineHasNotBeenSaved', type: 'error' });
    },
  });

  const {
    invoice,
    isFetching: isInvoiceFetching,
    isLoading: isInvoiceLoading,
    refetch: refetchInvoice,
  } = useInvoice(id);

  const {
    orders,
    isLoading: isOrdersLoading,
  } = useOrders(orderIds?.length ? [orderIds[0]] : undefined);

  const {
    orderLines,
    isLoading: isOrderLinesLoading,
  } = useOrderLines(orderIds);

  const {
    organization: invoiceVendor,
    isLoading: isVendorLoading,
  } = useOrganization(isCreate ? orders?.[0]?.vendor : invoice.vendorId);

  const {
    adjustmentPresets,
    isLoading: isAdjustmentPresetsLoading,
  } = useAdjustmentsSettings();

  const {
    addresses,
    isLoading: isAddressesLoading,
  } = useAddresses();

  const {
    batchGroups,
    isLoading: isBatchGroupsLoading,
  } = useBatchGroups();

  useEffect(() => {
    mutator.invoiceFormDocuments.reset();
    mutator.invoiceFormDocuments.GET();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const alwaysShowAdjustments = useMemo(() => getAlwaysShownAdjustmentsList(adjustmentPresets), [adjustmentPresets]);
  const invoiceDocuments = get(resources, 'invoiceFormDocuments.records', []);
  const documents = useMemo(() => invoiceDocuments.filter(invoiceDocument => !invoiceDocument.url), [invoiceDocuments]);
  const links = useMemo(() => invoiceDocuments.filter(invoiceDocument => invoiceDocument.url), [invoiceDocuments]);

  const batchGroupId = isCreate && (batchGroups?.length === 1)
    ? batchGroups?.[0]?.id
    : undefined;

  const saveButtonLabelId = (isCreateFromOrder && orderLines?.length > 1)
    ? 'ui-invoice.saveAndContinue'
    : 'stripes-components.saveAndClose';

  const exportToAccounting = useMemo(() => {
    return alwaysShowAdjustments.some(adj => adj.exportToAccounting);
  }, [alwaysShowAdjustments]);

  const initialInvoice = useMemo(() => {
    // Get the vendor's latest currency as default
    const vendorPreferredCurrency = invoiceVendor?.vendorCurrencies?.slice(-1)[0];
    const currency = orderLines?.[0]?.cost?.currency || vendorPreferredCurrency || stripes.currency;

    return !isCreate
      ? invoice
      : {
        chkSubscriptionOverlap: true,
        currency,
        exchangeRate: orderLines?.[0]?.cost?.exchangeRate,
        source: sourceValues.user,
        adjustments: alwaysShowAdjustments,
        batchGroupId,
        status: INVOICE_STATUS.open,
        exportToAccounting,
        vendorId: orders?.[0]?.vendor,
      };
  }, [
    alwaysShowAdjustments,
    batchGroupId,
    exportToAccounting,
    invoice,
    invoiceVendor,
    isCreate,
    orderLines,
    orders,
    stripes.currency,
  ]);

  const initialValues = useMemo(() => {
    const { accountingCode, accountNo } = initialInvoice;

    return {
      ...initialInvoice,
      accountNo: accountingCode && !accountNo ? NO_ACCOUNT_NUMBER : accountNo,
      documents,
      links,
    };
  }, [documents, initialInvoice, links]);

  const onClose = useCallback((invoiceId) => {
    if (isCreateFromOrder) {
      const ordersPath = orderIds.length > 1 ? '/orders' : `/orders/view/${orderIds[0]}`;

      history.push(ordersPath);
    } else onCancel(invoiceId);
  }, [onCancel, history, isCreateFromOrder, orderIds]);

  const saveFromOrdersHandler = useCallback(async (savedRecord) => {
    if (orderLines?.length) {
      if (orderLines.length > 1) {
        history.push(`/invoice/view/${savedRecord.id}/lines-sequence`, { orderIds });

        return;
      }

      const data = createInvoiceLineFromPOL(orderLines[0], savedRecord.id, invoiceVendor);

      try {
        await mutateInvoiceLine({ data });
      } catch {
        onCancel(savedRecord.id);
      }
    }

    onCancel(savedRecord.id);
  }, [history, invoiceVendor, mutateInvoiceLine, onCancel, orderIds, orderLines]);

  const saveAndKeepEditingHandler = useCallback(async (savedRecord) => {
    if (!id) {
      history.push({
        pathname: `/invoice/edit/${savedRecord.id}`,
        search: location.search,
      });
    }

    await refetchInvoice();
  }, [history, id, location.search, refetchInvoice]);

  const saveInvoiceHandler = useCallback((
    {
      [SUBMIT_ACTION_FIELD_NAME]: submitAction,
      accountNo,
      ..._formValues
    },
    form,
  ) => {
    let validationRequest = Promise.resolve();
    const formValues = {
      ..._formValues,
      accountNo: accountNo === NO_ACCOUNT_NUMBER ? null : accountNo,
    };

    if (!forceSaveValues) {
      const { vendorInvoiceNo, invoiceDate, vendorId } = formValues;
      const date = moment.utc(invoiceDate).format(DATE_FORMAT);
      const params = {
        limit: `${LIMIT_MAX}`,
        query: `id<>"${id}" AND vendorInvoiceNo=="${vendorInvoiceNo}" AND invoiceDate=="${date}*" AND vendorId=="${vendorId}"`,
      };
      const duplicateInvoicePromise = mutator.invoiceFormInvoices.GET({ params });
      const vendorPromise = mutator.duplicateInvoiceVendor.GET({ path: `${VENDORS_API}/${vendorId}` });

      validationRequest = Promise.all([duplicateInvoicePromise, vendorPromise])
        // eslint-disable-next-line consistent-return
        .then(([existingInvoices, vendor]) => {
          if (existingInvoices.length) {
            setForceSaveValues({
              [SUBMIT_ACTION_FIELD_NAME]: submitAction,
              ...formValues,
            });

            const duplicates = existingInvoices.map(i => ({ ...i, vendor }));

            setDuplicateInvoices(duplicates);

            // eslint-disable-next-line prefer-promise-reject-errors
            return Promise.reject({ validationError: VALIDATION_ERRORS.duplicateInvoice });
          }
        });
    }

    return validationRequest
      .then(() => saveInvoice(formValues, invoiceDocuments, mutator.invoiceFormInvoices, okapi))
      .then(async (savedRecord) => {
        showToast({ messageId: 'ui-invoice.invoice.invoiceHasBeenSaved' });

        switch (submitAction) {
          case SUBMIT_ACTION.saveFromOrders: {
            await saveFromOrdersHandler(savedRecord);
            break;
          }
          case SUBMIT_ACTION.saveAndKeepEditing: {
            await saveAndKeepEditingHandler(savedRecord);
            form.restart();
            break;
          }
          case SUBMIT_ACTION.saveAndClose:
          default:
            onClose(savedRecord.id);
            break;
        }
      })
      .catch(({ validationError }) => {
        if (validationError === VALIDATION_ERRORS.duplicateInvoice) return toggleNotUnique();

        return showToast({ messageId: 'ui-invoice.errors.invoiceHasNotBeenSaved', type: 'error' });
      });
  },
  [
    forceSaveValues,
    id,
    mutator.invoiceFormInvoices,
    mutator.duplicateInvoiceVendor,
    invoiceDocuments,
    okapi,
    showToast,
    onClose,
    saveFromOrdersHandler,
    saveAndKeepEditingHandler,
    toggleNotUnique,
  ]);

  const hasLoaded = !(
    isInvoiceLoading
    || isOrdersLoading
    || isOrderLinesLoading
    || isVendorLoading
    || isAdjustmentPresetsLoading
    || isAddressesLoading
    || isBatchGroupsLoading
  );

  if (!hasLoaded) {
    return (
      <Paneset>
        <LoadingPane onClose={onClose} />
      </Paneset>
    );
  }

  return (
    <>
      <InvoiceForm
        adjustmentPresets={adjustmentPresets}
        addresses={addresses}
        initialValues={initialValues}
        initialVendor={invoiceVendor}
        isSubmitDisabled={isInvoiceFetching}
        onSubmit={saveInvoiceHandler}
        onCancel={onClose}
        batchGroups={batchGroups}
        isCreateFromOrder={isCreateFromOrder}
        saveButtonLabelId={saveButtonLabelId}
        hasPoLines={Boolean(orderLines?.length)}
      />
      {
        isNotUniqueOpen && (
          <DuplicateInvoiceModal
            duplicateInvoices={duplicateInvoices}
            onSubmit={() => {
              toggleNotUnique();
              saveInvoiceHandler(forceSaveValues);
            }}
            onCancel={() => {
              toggleNotUnique();
              setForceSaveValues(null);
            }}
          />
        )
      }
    </>
  );
}

InvoiceFormContainerComponent.manifest = Object.freeze({
  invoice: {
    ...invoiceResource,
    fetch: false,
  },
  invoiceFormDocuments: {
    ...invoiceDocumentsResource,
    accumulate: true,
  },
  duplicateInvoiceVendor: {
    ...baseManifest,
    fetch: false,
    accumulate: true,
  },
  invoiceFormInvoices: {
    ...invoicesResource,
    accumulate: true,
    fetch: false,
  },
});

InvoiceFormContainerComponent.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  mutator: PropTypes.object.isRequired,
  okapi: PropTypes.object.isRequired,
  onCancel: PropTypes.func,
  resources: PropTypes.object.isRequired,
  stripes: PropTypes.object.isRequired,
};

export default withRouter(stripesConnect(InvoiceFormContainerComponent));
