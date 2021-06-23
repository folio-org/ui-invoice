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
  useShowCallout,
  VENDORS_API,
} from '@folio/stripes-acq-components';

import { INVOICE_STATUS } from '../../common/constants';
import {
  batchGroupsResource,
  CONFIG_ADJUSTMENTS,
  configAddress,
  invoiceDocumentsResource,
  invoiceResource,
  invoicesResource,
  VENDOR,
} from '../../common/resources';
import {
  getSettingsAdjustmentsList,
} from '../../settings/adjustments/util';
import InvoiceForm from './InvoiceForm';
import {
  saveInvoice,
  getAlwaysShownAdjustmentsList,
} from './utils';
import DuplicateInvoiceModal from './DuplicateInvoiceModal/DuplicateInvoiceModal';

function InvoiceFormContainer({
  match,
  mutator,
  okapi,
  onCancel,
  resources,
  stripes,
}) {
  const [batchGroups, setBatchGroups] = useState();
  const [duplicateInvoices, setDuplicateInvoices] = useState();

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
            toggleNotUnique();
            setForceSaveValues(formValues);

            const duplicates = existingInvoices.map(i => ({ ...i, vendor }));

            setDuplicateInvoices(duplicates);

            return Promise.reject();
          }
        });
    }

    return validationRequest
      .then(() => saveInvoice(formValues, invoiceDocuments, mutator.invoiceFormInvoices, okapi))
      .then(savedRecord => {
        showToast({ messageId: 'ui-invoice.invoice.invoiceHasBeenSaved' });

        setTimeout(() => onCancel(savedRecord.id));
      })
      .catch(() => {
        showToast({ messageId: 'ui-invoice.errors.invoiceHasNotBeenSaved', type: 'error' });
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forceSaveValues, id, toggleNotUnique, invoiceDocuments, okapi, showToast, onCancel]);

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
      status: INVOICE_STATUS.open,
    };

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
        batchGroups={batchGroups}
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

InvoiceFormContainer.manifest = Object.freeze({
  invoice: invoiceResource,
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
