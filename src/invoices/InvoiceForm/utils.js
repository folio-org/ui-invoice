import React from 'react';
import { FormattedMessage } from 'react-intl';
import { differenceBy } from 'lodash';

import { INVOICES_API } from '@folio/stripes-acq-components';

import {
  CONTENT_TYPES,
  INVOICE_DOCUMENTS_API,
} from '../../common/constants';
import { getLegacyTokenHeader } from '../../common/utils';
import { getAdjustmentFromPreset } from '../utils';

export const hydrateInvoiceDocument = (invoiceDocument, invoice) => {
  const documentMetadata = {
    invoiceId: invoice.id,
    name: invoiceDocument.name,
    url: invoiceDocument.url,
  };

  if (invoiceDocument.data) {
    return {
      documentMetadata,
      contents: {
        data: invoiceDocument.data,
      },
    };
  } else {
    return { documentMetadata };
  }
};

export const saveDocument = (documentBody, okapi) => {
  return fetch(`${okapi.url}/${INVOICES_API}/${documentBody.documentMetadata.invoiceId}${INVOICE_DOCUMENTS_API}`, {
    method: 'POST',
    headers: {
      'X-Okapi-Tenant': okapi.tenant,
      'Content-Type': CONTENT_TYPES.octet,
      ...getLegacyTokenHeader(okapi),
    },
    credentials: 'include',
    body: JSON.stringify(documentBody),
  });
};

export const deleteDocument = ({ id, invoiceId }, okapi) => {
  return fetch(`${okapi.url}/${INVOICES_API}/${invoiceId}${INVOICE_DOCUMENTS_API}/${id}`, {
    method: 'DELETE',
    headers: {
      'X-Okapi-Tenant': okapi.tenant,
      'Content-Type': CONTENT_TYPES.json,
      ...getLegacyTokenHeader(okapi),
    },
    credentials: 'include',
  });
};

export const saveInvoice = async (invoice, prevDocuments, invoiceMutator, okapi) => {
  const saveMethod = invoice.id ? 'PUT' : 'POST';

  const invoiceBody = {
    ...invoice,
    documents: undefined,
    links: undefined,
  };
  const invoiceDocuments = [...(invoice.documents || []), ...(invoice.links || [])];

  const savedInvoice = await invoiceMutator[saveMethod](invoiceBody);

  await Promise.all(
    differenceBy(prevDocuments, invoiceDocuments, 'id')
      .map(invoiceDocument => deleteDocument(invoiceDocument, okapi)),
  );

  await Promise.all(
    invoiceDocuments
      .filter(invoiceDocument => !invoiceDocument.id)
      .map(invoiceDocument => {
        const invoiceDocumentBody = hydrateInvoiceDocument(invoiceDocument, savedInvoice);

        return saveDocument(invoiceDocumentBody, okapi);
      }),
  );

  return savedInvoice;
};

export const getAlwaysShownAdjustmentsList = (adjustments) => (
  adjustments.filter(({ adjustment }) => adjustment.alwaysShow).map(({ adjustment }) => {
    return getAdjustmentFromPreset(adjustment);
  })
);

export const validateAccountingCode = (value) => {
  return value ? undefined : <FormattedMessage id="ui-invoice.invoice.validation.accountingCode" />;
};
