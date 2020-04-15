import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { withRouter } from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';

import {
  LoadingView,
} from '@folio/stripes/components';
import { stripesConnect } from '@folio/stripes/core';

import { VENDORS_API } from '../../common/constants';
import {
  CONFIG_ADJUSTMENTS,
  invoiceLineResource,
  invoiceResource,
  VENDOR,
} from '../../common/resources';
import { getSettingsAdjustmentsList } from '../../settings/adjustments/util';
import InvoiceLineForm from './InvoiceLineForm';

function InvoiceLineFormContainer({
  match: { params: { id, lineId } },
  onClose,
  mutator,
  resources,
  showCallout,
  stripes,
}) {
  const [invoiceLine, setInvoiceLine] = useState();
  const [invoice, setInvoice] = useState();
  const [vendor, setVendor] = useState();

  useEffect(
    () => {
      (lineId
        ? mutator.invoiceLine.GET()
        : Promise.resolve({
          invoiceId: id,
          invoiceLineStatus: invoice.status,
          fundDistributions: [],
        }))
        .then(setInvoiceLine)
        .catch(() => {
          showCallout({
            messageId: 'ui-invoice.errors.cantLoadInvoiceLine',
            type: 'error',
            timeout: 0,
          });
        });
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

    mutator.invoiceLine[mutatorMethod](values)
      .then(() => {
        showCallout({ messageId: 'ui-invoice.invoiceLine.hasBeenSaved' });
        onClose();
      })
      .catch(() => {
        showCallout({ messageId: 'ui-invoice.errors.invoiceLineHasNotBeenSaved', type: 'error' });

        return { id: 'Unable to save invoice line' };
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onClose, showCallout]);

  const hasLoaded = invoice && invoiceLine && vendor;
  const vendorCode = get(vendor, 'erpCode', '');
  const accounts = get(vendor, 'accounts', []);
  const adjustmentsPresets = getSettingsAdjustmentsList(get(resources, ['configAdjustments', 'records'], []));

  return (hasLoaded
    ? (
      <InvoiceLineForm
        stripes={stripes}
        initialValues={invoiceLine}
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

InvoiceLineFormContainer.manifest = Object.freeze({
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
});

InvoiceLineFormContainer.propTypes = {
  onClose: PropTypes.func.isRequired,
  resources: PropTypes.object.isRequired,
  stripes: PropTypes.object.isRequired,
  showCallout: PropTypes.func.isRequired,
  match: ReactRouterPropTypes.match,
  mutator: PropTypes.object.isRequired,
};

export default withRouter(stripesConnect(InvoiceLineFormContainer));
