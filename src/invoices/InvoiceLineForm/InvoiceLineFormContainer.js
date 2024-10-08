import React, { useMemo, useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { withRouter } from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';

import {
  LoadingView,
} from '@folio/stripes/components';
import {
  stripesConnect,
  useOkapiKy,
} from '@folio/stripes/core';
import {
  baseManifest,
  VENDORS_API,
} from '@folio/stripes-acq-components';

import {
  CONFIG_ADJUSTMENTS,
  invoiceLineResource,
  invoiceResource,
  VENDOR,
} from '../../common/resources';
import { getSettingsAdjustmentsList } from '../../settings/adjustments/util';
import { showUpdateInvoiceError } from '../InvoiceDetails/utils';
import InvoiceLineForm from './InvoiceLineForm';

export function InvoiceLineFormContainerComponent({
  match: { params: { id, lineId } },
  onClose,
  mutator,
  resources,
  showCallout,
}) {
  const ky = useOkapiKy();
  const [invoiceLine, setInvoiceLine] = useState();
  const [invoice, setInvoice] = useState();
  const [vendor, setVendor] = useState();

  useEffect(
    () => {
      if (lineId) {
        mutator.invoiceLine.GET()
          .then(setInvoiceLine)
          .catch(() => {
            showCallout({
              messageId: 'ui-invoice.errors.cantLoadInvoiceLine',
              type: 'error',
              timeout: 0,
            });
          });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lineId],
  );

  useEffect(
    () => {
      mutator.invoice.GET()
        .then(
          invoiceResponse => {
            setInvoice(invoiceResponse);

            return invoiceResponse.vendorId
              ? mutator.vendor.GET({ path: `${VENDORS_API}/${invoiceResponse.vendorId}` })
              : {};
          },
          () => {
            showCallout({
              messageId: 'ui-invoice.errors.cantLoadInvoice',
              type: 'error',
              timeout: 0,
            });
          },
        )
        .then(setVendor)
        .catch(() => {
          showCallout({
            messageId: 'ui-invoice.errors.cantLoadVendor',
            type: 'error',
            timeout: 0,
          });
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [id],
  );
  const saveInvoiceLine = useCallback((values) => {
    const mutatorMethod = values.id ? 'PUT' : 'POST';

    return mutator.invoiceLine[mutatorMethod](values)
      .then(() => {
        showCallout({ messageId: 'ui-invoice.invoiceLine.hasBeenSaved' });
        onClose();
      })
      .catch((response) => {
        showUpdateInvoiceError({
          response,
          showCallout,
          action: 'saveLine',
          defaultErrorMessageId: 'ui-invoice.errors.invoiceLineHasNotBeenSaved',
          expenseClassMutator: mutator.expenseClass,
          fundMutator: mutator.fund,
          ky,
        });

        return { id: 'Unable to save invoice line' };
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onClose, showCallout]);

  const hasLoaded = (!lineId || invoiceLine) && invoice && vendor;
  const vendorCode = get(vendor, 'erpCode', '');
  const accounts = get(vendor, 'accounts', []);
  const adjustmentsPresets = getSettingsAdjustmentsList(get(resources, ['configAdjustments', 'records'], []));
  const initialValues = useMemo(() => {
    return lineId
      ? invoiceLine
      : {
        invoiceId: id,
        invoiceLineStatus: invoice?.status,
        fundDistributions: [],
        releaseEncumbrance: false,
      };
  }, [id, lineId, invoice, invoiceLine]);

  return (hasLoaded
    ? (
      <InvoiceLineForm
        initialValues={initialValues}
        onSubmit={saveInvoiceLine}
        onCancel={onClose}
        vendorCode={vendorCode}
        accounts={accounts}
        invoice={invoice}
        adjustmentsPresets={adjustmentsPresets}
      />
    )
    : (
      <LoadingView
        dismissible
        onClose={onClose}
      />
    )
  );
}

InvoiceLineFormContainerComponent.manifest = Object.freeze({
  invoice: {
    ...invoiceResource,
    accumulate: true,
    fetch: false,
  },
  invoiceLine: {
    ...invoiceLineResource,
    accumulate: true,
    fetch: false,
  },
  vendor: {
    ...VENDOR,
    accumulate: true,
    fetch: false,
  },
  configAdjustments: CONFIG_ADJUSTMENTS,
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

InvoiceLineFormContainerComponent.propTypes = {
  onClose: PropTypes.func.isRequired,
  resources: PropTypes.object.isRequired,
  showCallout: PropTypes.func.isRequired,
  match: ReactRouterPropTypes.match,
  mutator: PropTypes.object.isRequired,
};

export default withRouter(stripesConnect(InvoiceLineFormContainerComponent));
