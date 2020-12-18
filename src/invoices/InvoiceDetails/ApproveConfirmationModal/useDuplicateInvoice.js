import { useEffect, useState } from 'react';
import moment from 'moment';

import {
  batchFetch,
  LIMIT_MAX,
  DATE_FORMAT,
  useShowCallout,
} from '@folio/stripes-acq-components';

const useDuplicateInvoice = (mutator, invoice) => {
  const showCallout = useShowCallout();
  const [invoices, setInvoices] = useState();
  const formattedInvoiceDate = moment.utc(invoice.invoiceDate)?.format(DATE_FORMAT);

  useEffect(() => {
    mutator.duplicateInvoices.GET({
      limit: `${LIMIT_MAX}`,
      params: {
        query: `id<>"${invoice.id}" AND
          vendorInvoiceNo=="${invoice.vendorInvoiceNo}" AND
          invoiceDate=="${formattedInvoiceDate}*" AND
          vendorId=="${invoice.vendorId}"`,
      },
    })
      .then(invoiceResp => {
        const vendorIds = [...new Set(invoiceResp.map(inv => inv.vendorId))];
        const vendorPromise = batchFetch(mutator.vendors, vendorIds).catch(() => setInvoices(invoiceResp));

        return Promise.all([vendorPromise, invoiceResp]);
      })
      .then(([vendorResp, invoiceResp]) => (
        vendorResp && setInvoices(() => (
          invoiceResp.map(inv => ({
            ...inv,
            vendor: vendorResp.find(v => v.id === inv.vendorId),
          }))
        ))
      ))
      .catch(() => showCallout({ messageId: 'ui-invoice.invoice.actions.load.error', type: 'error' }));
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [invoice, showCallout]);

  return [invoices];
};

export default useDuplicateInvoice;
