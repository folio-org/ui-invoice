import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import ReactRouterPropTypes from 'react-router-prop-types';
import { withRouter } from 'react-router-dom';
import moment from 'moment';

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
  useModalToggle,
  useOrganization,
  useShowCallout,
  VENDORS_API,
} from '@folio/stripes-acq-components';

import {
  INVOICE_STATUS,
  VALIDATION_ERRORS,
} from '../../common/constants';
import {
  batchGroupsResource,
  CONFIG_ADJUSTMENTS,
  configAddress,
  invoiceDocumentsResource,
  invoiceResource,
  invoicesResource,
} from '../../common/resources';
import {
  useInvoice,
  useInvoiceLineMutation,
  useOrderLines,
  useOrders,
} from '../../common/hooks';
import {
  getSettingsAdjustmentsList,
} from '../../settings/adjustments/util';
import { createInvoiceLineFromPOL } from '../InvoiceDetails/utils';
import InvoiceForm from './InvoiceForm';
import {
  saveInvoice,
  getAlwaysShownAdjustmentsList,
} from './utils';
import DuplicateInvoiceModal from './DuplicateInvoiceModal/DuplicateInvoiceModal';

export function InvoiceFormContainerComponent({
  location,
  history,
  match,
  mutator,
  okapi,
  onCancel,
  resources,
  stripes,
}) {
  const { params: { id } } = match;
  const isCreate = !id;
  const showToast = useShowCallout();
  const [batchGroups, setBatchGroups] = useState();
  const [duplicateInvoices, setDuplicateInvoices] = useState();
  const orderIds = location?.state?.orderIds;
  const { invoice, isInvoiceLoading } = useInvoice(id);
  const { orders, isLoading: isOrdersLoading } = useOrders(orderIds ? [orderIds[0]] : undefined);
  const { orderLines, isLoading: isOrderLinesLoading } = useOrderLines(orderIds);
  const invoiceVendorId = isCreate ? orders?.[0]?.vendor : invoice.vendorId;
  const { organization: invoiceVendor, isLoading: isVendorLoading } = useOrganization(invoiceVendorId);
  const { mutateInvoiceLine } = useInvoiceLineMutation({
    onSuccess: () => {
      return showToast({ messageId: 'ui-invoice.invoiceLine.hasBeenSaved' });
    },
    onError: () => {
      return showToast({ messageId: 'ui-invoice.errors.invoiceLineHasNotBeenSaved', type: 'error' });
    },
  });

  useEffect(() => {
    setBatchGroups();

    mutator.invoiceFormDocuments.reset();
    mutator.invoiceFormDocuments.GET();

    mutator.batchGroups.GET()
      .then(setBatchGroups)
      .catch(() => setBatchGroups([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [isNotUniqueOpen, toggleNotUnique] = useModalToggle();
  const [forceSaveValues, setForceSaveValues] = useState();
  const invoiceDocuments = get(resources, 'invoiceFormDocuments.records', []);

  const saveInvoiceHandler = useCallback(formValues => {
    let validationRequest = Promise.resolve();

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
            setForceSaveValues(formValues);

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

        if (orderLines?.length) {
          if (orderLines.length > 1) return history.push(`/invoice/view/${savedRecord.id}/lines-sequence`, { orderIds });

          const data = createInvoiceLineFromPOL(orderLines[0], savedRecord.id, invoiceVendor);

          try {
            await mutateInvoiceLine({ data });
          } catch {
            return onCancel(savedRecord.id);
          }
        }

        return onCancel(savedRecord.id);
      })
      .catch(({ validationError }) => {
        if (validationError === VALIDATION_ERRORS.duplicateInvoice) return toggleNotUnique();

        return showToast({ messageId: 'ui-invoice.errors.invoiceHasNotBeenSaved', type: 'error' });
      });
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [
    forceSaveValues,
    id,
    toggleNotUnique,
    invoiceDocuments,
    okapi,
    showToast,
    onCancel,
    orderIds,
    orderLines,
    history,
    mutateInvoiceLine,
    invoiceVendor,
  ]);

  const allAdjustments = getSettingsAdjustmentsList(get(resources, ['configAdjustments', 'records'], []));
  const alwaysShowAdjustments = getAlwaysShownAdjustmentsList(allAdjustments);
  const batchGroupId = isCreate && (batchGroups?.length === 1) ? batchGroups[0]?.id : undefined;
  const exportToAccounting = alwaysShowAdjustments.some(adj => adj.exportToAccounting);
  const initialInvoice = !isCreate
    ? invoice
    : {
      chkSubscriptionOverlap: true,
      currency: stripes.currency,
      source: sourceValues.user,
      adjustments: alwaysShowAdjustments,
      batchGroupId,
      status: INVOICE_STATUS.open,
      exportToAccounting,
      vendorId: orders?.[0]?.vendor,
    };

  const initialValues = {
    ...initialInvoice,
    documents: invoiceDocuments.filter(invoiceDocument => !invoiceDocument.url),
    links: invoiceDocuments.filter(invoiceDocument => invoiceDocument.url),
  };

  const hasLoaded = batchGroups && !(isInvoiceLoading || isOrdersLoading || isOrderLinesLoading || isVendorLoading);

  if (!hasLoaded) {
    return (
      <Paneset>
        <LoadingPane onClose={onCancel} />
      </Paneset>
    );
  }

  return (
    <>
      <InvoiceForm
        initialValues={initialValues}
        initialVendor={invoiceVendor}
        parentResources={resources}
        onSubmit={saveInvoiceHandler}
        onCancel={onCancel}
        batchGroups={batchGroups}
        isCreateFromOrder={Boolean(orderIds?.length)}
      />
      {
        isNotUniqueOpen && (
          <DuplicateInvoiceModal
            duplicateInvoices={duplicateInvoices}
            onSubmit={() => saveInvoiceHandler(forceSaveValues)}
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
  configAdjustments: CONFIG_ADJUSTMENTS,
  configAddress,
  batchGroups: batchGroupsResource,
});

InvoiceFormContainerComponent.propTypes = {
  match: ReactRouterPropTypes.match.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  mutator: PropTypes.object.isRequired,
  okapi: PropTypes.object.isRequired,
  onCancel: PropTypes.func,
  resources: PropTypes.object.isRequired,
  stripes: PropTypes.object.isRequired,
};

export default withRouter(stripesConnect(InvoiceFormContainerComponent));
