import React, { Fragment, useCallback, useEffect, useState } from 'react';
import {
  FormattedMessage,
  injectIntl,
  intlShape,
} from 'react-intl';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import ReactRouterPropTypes from 'react-router-prop-types';
import { withRouter } from 'react-router-dom';

import {
  ConfirmationModal,
  Layer,
} from '@folio/stripes/components';
import { stripesConnect } from '@folio/stripes/core';
import {
  sourceValues,
  useModalToggle,
  useShowToast,
} from '@folio/stripes-acq-components';

import {
  invoiceResource,
  invoiceDocumentsResource,
} from '../../../common/resources';
import { LoadingPane } from '../../../common/components';
import {
  saveInvoice,
} from '../utils';
import {
  getAlwaysShownAdjustmentsList,
} from './utils';
import {
  getSettingsAdjustmentsList,
} from '../../../settings/adjustments/util';
import InvoiceForm from '../../InvoiceForm';

function InvoiceEditLayer({
  connectedSource,
  intl,
  match,
  mutator,
  okapi,
  onCancel,
  onCloseEdit,
  onSubmit,
  parentMutator,
  parentResources,
  resources,
  stripes,
}) {
  useEffect(() => {
    mutator.invoiceDocuments.reset();
    mutator.invoiceDocuments.GET();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [isNotUniqueOpen, toggleNotUnique] = useModalToggle();
  const [forceSaveValues, setForceSaveValues] = useState();
  const showToast = useShowToast();
  const closeScreen = onCancel || onCloseEdit;
  const { params: { id } } = match;
  const isCreate = !id;
  const invoiceDocuments = get(resources, 'invoiceDocuments.records', []);

  const saveInvoiceHandler = useCallback(formValues => {
    let validationRequest = Promise.resolve();

    if (!forceSaveValues) {
      const { vendorInvoiceNo, invoiceDate, vendorId } = formValues;
      const params = {
        query: `id<>"${id}" AND vendorInvoiceNo=="${vendorInvoiceNo}" AND invoiceDate=="${invoiceDate}*" AND vendorId=="${vendorId}"`,
      };

      validationRequest = parentMutator.validateInvoice.GET({ params })
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
      .then(() => saveInvoice(formValues, invoiceDocuments, parentMutator.records, okapi))
      .then(savedRecord => {
        showToast('ui-invoice.invoice.invoiceHasBeenSaved');
        if (isCreate) {
          onSubmit(savedRecord);
        } else {
          setTimeout(onCloseEdit);
        }
      })
      .catch(() => {
        showToast('ui-invoice.errors.invoiceHasNotBeenSaved', 'error');
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forceSaveValues, id, isCreate, okapi, invoiceDocuments]);

  const allAdjustments = getSettingsAdjustmentsList(get(parentResources, ['configAdjustments', 'records'], []));
  const alwaysShowAdjustments = getAlwaysShownAdjustmentsList(allAdjustments);
  const invoice = !isCreate
    ? get(resources, ['invoice', 'records', 0], {})
    : {
      chkSubscriptionOverlap: true,
      currency: stripes.currency,
      source: sourceValues.user,
    };
  const initialAdjustmentsValue = isCreate ? alwaysShowAdjustments : invoice.adjustments;
  const initialValues = {
    ...invoice,
    documents: invoiceDocuments.filter(invoiceDocument => !invoiceDocument.url),
    links: invoiceDocuments.filter(invoiceDocument => invoiceDocument.url),
    adjustments: initialAdjustmentsValue,
  };

  const hasLoaded = !id || get(resources, 'invoice.hasLoaded');

  const formNode = hasLoaded
    ? (
      <Fragment>
        <InvoiceForm
          stripes={stripes}
          initialValues={initialValues}
          connectedSource={connectedSource}
          parentResources={parentResources}
          parentMutator={parentMutator}
          onSubmit={saveInvoiceHandler}
          onCancel={closeScreen}
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

    )
    : <LoadingPane onClose={closeScreen} />;

  return isCreate
    ? formNode
    : (
      <Layer
        contentLabel={intl.formatMessage({ id: 'ui-invoice.invoice.editLayer' })}
        isOpen
      >
        {formNode}
      </Layer>
    );
}

InvoiceEditLayer.manifest = Object.freeze({
  invoice: invoiceResource,
  invoiceDocuments: {
    ...invoiceDocumentsResource,
    accumulate: true,
  },
});

InvoiceEditLayer.propTypes = {
  connectedSource: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  mutator: PropTypes.object.isRequired,
  okapi: PropTypes.object.isRequired,
  onCancel: PropTypes.func,  // SearchAndSort callback to close create form
  onCloseEdit: PropTypes.func,
  onSubmit: PropTypes.func,  // SearchAndSort callback when item is created
  parentMutator: PropTypes.object.isRequired,
  parentResources: PropTypes.object.isRequired,
  resources: PropTypes.object.isRequired,
  stripes: PropTypes.object.isRequired,
};

export default withRouter(stripesConnect(injectIntl(InvoiceEditLayer)));
