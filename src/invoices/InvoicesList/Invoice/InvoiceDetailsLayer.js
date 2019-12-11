import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import ReactRouterPropTypes from 'react-router-prop-types';

import { stripesConnect } from '@folio/stripes/core';
import { withTags } from '@folio/stripes/smart-components';

import { LoadingPane } from '../../../common/components';
import {
  invoiceResource,
  invoiceLinesResource,
  VENDOR,
} from '../../../common/resources';
import InvoiceDetails from '../../InvoiceDetails';
import { createInvoiceLineFromPOL } from './utils';

function InvoiceDetailsLayer({
  onClose,
  onEdit,
  resources,
  tagsEnabled,
  tagsToggle,
  match: { url },
  match: { params: { id } },
  mutator,
  showToast,
  stripes,
}) {
  const createLine = () => {
    mutator.query.update({ _path: `${url}/line/create` });
  };

  const addLines = poLines => {
    const { id: invoiceId } = get(resources, ['invoice', 'records', 0]);
    const vendor = get(resources, ['vendor', 'records', 0]);

    poLines.map(
      poLine => mutator.invoiceLines.POST(createInvoiceLineFromPOL(poLine, invoiceId, vendor)),
    );
  };

  const deleteInvoice = useCallback(
    () => {
      mutator.invoice.DELETE({ id })
        .then(() => {
          showToast('ui-invoice.invoice.invoiceHasBeenDeleted');
          onClose();
        })
        .catch(() => {
          showToast('ui-invoice.errors.invoiceHasNotBeenDeleted', 'error');
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [id],
  );

  const invoice = get(resources, ['invoice', 'records', 0]);
  const hasLoaded = get(resources, 'invoice.hasLoaded');
  const totalInvoiceLines = get(resources, ['invoiceLines', 'other', 'totalRecords'], 0);
  const invoiceTotalUnits = get(resources, 'invoiceLines.records.0.invoiceLines', []).reduce((total, line) => (
    total + +line.quantity
  ), 0);

  return hasLoaded
    ? (
      <InvoiceDetails
        addLines={addLines}
        createLine={createLine}
        onClose={onClose}
        onEdit={onEdit}
        invoice={invoice}
        totalInvoiceLines={totalInvoiceLines}
        invoiceTotalUnits={invoiceTotalUnits}
        deleteInvoice={deleteInvoice}
        tagsEnabled={tagsEnabled}
        tagsToggle={tagsToggle}
        stripes={stripes}
      />
    )
    : <LoadingPane onClose={onClose} />;
}

InvoiceDetailsLayer.manifest = Object.freeze({
  invoice: invoiceResource,
  invoiceLines: {
    ...invoiceLinesResource,
    fetch: false,
  },
  vendor: VENDOR,
  query: {},
});

InvoiceDetailsLayer.propTypes = {
  match: ReactRouterPropTypes.match,
  mutator: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  resources: PropTypes.object.isRequired,
  showToast: PropTypes.func.isRequired,
  tagsToggle: PropTypes.func.isRequired,
  tagsEnabled: PropTypes.bool,
  stripes: PropTypes.object.isRequired,
};

InvoiceDetailsLayer.defaultProps = {
  tagsEnabled: false,
};

export default stripesConnect(withTags(InvoiceDetailsLayer));
