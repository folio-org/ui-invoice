import { differenceBy } from 'lodash';

import {
  CONTENT_TYPES,
  INVOICE_API,
  INVOICE_DOCUMENTS_API,
} from '../../common/constants';
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
  return fetch(`${okapi.url}/${INVOICE_API}/${documentBody.documentMetadata.invoiceId}${INVOICE_DOCUMENTS_API}`, {
    method: 'POST',
    headers: {
      'X-Okapi-Tenant': okapi.tenant,
      'X-Okapi-Token': okapi.token,
      'Content-Type': CONTENT_TYPES.json,
    },
    body: JSON.stringify(documentBody),
  });
};

export const deleteDocument = ({ id, invoiceId }, okapi) => {
  return fetch(`${okapi.url}/${INVOICE_API}/${invoiceId}${INVOICE_DOCUMENTS_API}/${id}`, {
    method: 'DELETE',
    headers: {
      'X-Okapi-Tenant': okapi.tenant,
      'X-Okapi-Token': okapi.token,
      'Content-Type': CONTENT_TYPES.json,
    },
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
