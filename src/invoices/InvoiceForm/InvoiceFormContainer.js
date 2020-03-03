import React, { Fragment, useCallback, useEffect, useState } from 'react';
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
  useShowToast,
} from '@folio/stripes-acq-components';

import {
  CONFIG_ADJUSTMENTS,
  configAddress,
  invoiceDocumentsResource,
  invoiceResource,
  invoicesResource,
  VENDORS,
} from '../../common/resources';
import { LoadingPane } from '../../common/components';
import {
  getSettingsAdjustmentsList,
} from '../../settings/adjustments/util';

import InvoiceForm, { INVOICE_FORM } from './InvoiceForm';
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
  useEffect(() => {
    mutator.invoiceFormDocuments.reset();
    mutator.invoiceFormDocuments.GET();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [isNotUniqueOpen, toggleNotUnique] = useModalToggle();
  const [forceSaveValues, setForceSaveValues] = useState();
  const showToast = useShowToast();
  const { params: { id } } = match;
  const isCreate = !id;
  const invoiceDocuments = get(resources, 'invoiceFormDocuments.records', []);

  const invoiceFormValues = getFormValues(INVOICE_FORM)(stripes.store.getState());

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
        showToast('ui-invoice.invoice.invoiceHasBeenSaved');

        setTimeout(() => onCancel(savedRecord.id));
      })
      .catch(() => {
        showToast('ui-invoice.errors.invoiceHasNotBeenSaved', 'error');
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forceSaveValues, id, isCreate, okapi, invoiceDocuments]);

  const allAdjustments = getSettingsAdjustmentsList(get(resources, ['configAdjustments', 'records'], []));
  const alwaysShowAdjustments = getAlwaysShownAdjustmentsList(allAdjustments);
  const invoice = !isCreate
    ? get(resources, ['invoiceFormInvoice', 'records', 0], {})
    : {
      chkSubscriptionOverlap: true,
      currency: stripes.currency,
      source: sourceValues.user,
      adjustments: alwaysShowAdjustments,
    };
  const initialValues = {
    ...invoice,
    documents: invoiceDocuments.filter(invoiceDocument => !invoiceDocument.url),
    links: invoiceDocuments.filter(invoiceDocument => invoiceDocument.url),
  };

  const hasLoaded = !id || get(resources, 'invoiceFormInvoice.hasLoaded');

  if (!hasLoaded) {
    return (
      <Paneset>
        <LoadingPane onClose={onCancel} />
      </Paneset>
    );
  }

  return (
    <Fragment>
      <InvoiceForm
        initialValues={initialValues}
        parentResources={resources}
        onSubmit={saveInvoiceHandler}
        onCancel={onCancel}
        filledBillTo={invoiceFormValues?.billTo}
        filledVendorId={invoiceFormValues?.vendorId}
        filledCurrency={invoiceFormValues?.currency}
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
    </Fragment>
  );
}

InvoiceFormContainer.manifest = Object.freeze({
  invoiceFormInvoice: invoiceResource,
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
  vendors: VENDORS,
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
