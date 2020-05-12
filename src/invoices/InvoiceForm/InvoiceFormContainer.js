import React, { useCallback, useEffect, useState } from 'react';
import {
  FormattedMessage,
} from 'react-intl';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import ReactRouterPropTypes from 'react-router-prop-types';
import { withRouter } from 'react-router-dom';
import {
  getFormValues,
} from 'redux-form';

import {
  ConfirmationModal,
  Paneset,
} from '@folio/stripes/components';
import { stripesConnect } from '@folio/stripes/core';
import {
  sourceValues,
  useModalToggle,
  useShowCallout,
} from '@folio/stripes-acq-components';

import {
  batchGroupsResource,
  CONFIG_ADJUSTMENTS,
  configAddress,
  invoiceDocumentsResource,
  invoiceResource,
  invoicesResource,
  VENDOR,
} from '../../common/resources';
import { LoadingPane } from '../../common/components';
import {
  getSettingsAdjustmentsList,
} from '../../settings/adjustments/util';
import { INVOICE_FORM } from '../constants';
import InvoiceForm from './InvoiceForm';
import {
  saveInvoice,
  getAlwaysShownAdjustmentsList,
} from './utils';

function InvoiceFormContainer({
  match,
  mutator,
  okapi,
  onCancel,
  resources,
  stripes,
}) {
  const [batchGroups, setBatchGroups] = useState();

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
  const showToast = useShowCallout();
  const { params: { id } } = match;
  const isCreate = !id;
  const invoiceDocuments = get(resources, 'invoiceFormDocuments.records', []);

  const saveInvoiceHandler = useCallback(formValues => {
    let validationRequest = Promise.resolve();

    if (!forceSaveValues) {
      const { vendorInvoiceNo, invoiceDate, vendorId } = formValues;
      const params = {
        query: `id<>"${id}" AND vendorInvoiceNo=="${vendorInvoiceNo}" AND invoiceDate=="${invoiceDate}*" AND vendorId=="${vendorId}"`,
      };

      validationRequest = mutator.invoiceFormInvoices.GET({ params })
        // eslint-disable-next-line consistent-return
        .then(existingInvoices => {
          if (existingInvoices.length) {
            toggleNotUnique();
            setForceSaveValues(formValues);

            return Promise.reject();
          }
        });
    }

    validationRequest
      .then(() => saveInvoice(formValues, invoiceDocuments, mutator.invoiceFormInvoices, okapi))
      .then(savedRecord => {
        showToast({ messageId: 'ui-invoice.invoice.invoiceHasBeenSaved' });

        setTimeout(() => onCancel(savedRecord.id));
      })
      .catch(() => {
        showToast({ messageId: 'ui-invoice.errors.invoiceHasNotBeenSaved', type: 'error' });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forceSaveValues, id, isCreate, okapi, invoiceDocuments]);

  const allAdjustments = getSettingsAdjustmentsList(get(resources, ['configAdjustments', 'records'], []));
  const alwaysShowAdjustments = getAlwaysShownAdjustmentsList(allAdjustments);
  const batchGroupId = isCreate && (batchGroups?.length === 1) ? batchGroups[0]?.id : undefined;
  const invoice = !isCreate
    ? get(resources, ['invoice', 'records', 0], {})
    : {
      chkSubscriptionOverlap: true,
      currency: stripes.currency,
      source: sourceValues.user,
      adjustments: alwaysShowAdjustments,
      batchGroupId,
    };

  const invoiceFormValues = getFormValues(INVOICE_FORM)(stripes.store.getState()) || invoice;
  const invoiceVendor = isCreate ? undefined : get(resources, ['invoiceFormVendor', 'records', 0]);
  const initialValues = {
    ...invoice,
    documents: invoiceDocuments.filter(invoiceDocument => !invoiceDocument.url),
    links: invoiceDocuments.filter(invoiceDocument => invoiceDocument.url),
  };

  const hasLoaded = (!id && batchGroups) || (
    get(resources, 'invoice.hasLoaded') && get(resources, 'invoiceFormVendor.hasLoaded') && batchGroups
  );

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
        filledBillTo={invoiceFormValues?.billTo}
        filledVendorId={invoiceFormValues?.vendorId}
        filledCurrency={invoiceFormValues?.currency}
        batchGroups={batchGroups}
      />
      {
        isNotUniqueOpen && (
          <ConfirmationModal
            id="invoice-is-not-unique-confirmation"
            heading={<FormattedMessage id="ui-invoice.invoice.isNotUnique.confirmation.heading" />}
            message={<FormattedMessage id="ui-invoice.invoice.isNotUnique.confirmation.message" />}
            onCancel={() => {
              toggleNotUnique();
              setForceSaveValues(null);
            }}
            onConfirm={() => saveInvoiceHandler(forceSaveValues)}
            open
          />
        )
      }
    </>
  );
}

InvoiceFormContainer.manifest = Object.freeze({
  invoice: invoiceResource,
  invoiceFormDocuments: {
    ...invoiceDocumentsResource,
    accumulate: true,
  },
  invoiceFormInvoices: {
    ...invoicesResource,
    accumulate: true,
    fetch: false,
  },
  configAdjustments: CONFIG_ADJUSTMENTS,
  configAddress,
  invoiceFormVendor: VENDOR,
  batchGroups: batchGroupsResource,
});

InvoiceFormContainer.propTypes = {
  match: ReactRouterPropTypes.match.isRequired,
  mutator: PropTypes.object.isRequired,
  okapi: PropTypes.object.isRequired,
  onCancel: PropTypes.func,
  resources: PropTypes.object.isRequired,
  stripes: PropTypes.object.isRequired,
};

export default withRouter(stripesConnect(InvoiceFormContainer));
