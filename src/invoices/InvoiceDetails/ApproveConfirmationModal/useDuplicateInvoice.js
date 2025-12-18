import keyBy from 'lodash/keyBy';
import {
  useEffect,
  useState,
} from 'react';

import { dayjs } from '@folio/stripes/components';
import {
  batchFetch,
  DATE_FORMAT,
  LIMIT_MAX,
  useShowCallout,
} from '@folio/stripes-acq-components';

const getInvoices = async (mutator, invoice) => {
  const formattedInvoiceDate = dayjs.utc(invoice.invoiceDate)?.format(DATE_FORMAT);

  try {
    return await mutator.duplicateInvoices.GET({
      limit: `${LIMIT_MAX}`,
      params: {
        query: `id<>"${invoice.id}" AND
          vendorInvoiceNo=="${invoice.vendorInvoiceNo}" AND
          invoiceDate=="${formattedInvoiceDate}*" AND
          vendorId=="${invoice.vendorId}"`,
      },
    });
  } catch {
    throw new Error('ui-invoice.invoice.actions.load.error');
  }
};

const getVendors = (mutator, vendorIds) => batchFetch(mutator.vendors, vendorIds).catch(() => []);

const getAll = async (mutator, invoice) => {
  const invoices = await getInvoices(mutator, invoice);
  const vendorIds = invoices.map(inv => inv.vendorId);
  const uniqueVendorIds = [...new Set(vendorIds)];
  const vendors = await getVendors(mutator, uniqueVendorIds);

  const vendorMap = keyBy(vendors, 'id');

  return invoices.map(inv => ({
    ...inv,
    vendor: vendorMap[inv.vendorId],
  }));
};

const useDuplicateInvoice = (mutator, invoice) => {
  const showCallout = useShowCallout();
  const [invoices, setInvoices] = useState();

  useEffect(
    () => {
      setInvoices();
      getAll(mutator, invoice)
        .then(setInvoices)
        .catch(({ message }) => showCallout({ messageId: message, type: 'error' }));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [invoice, showCallout],
  );

  return [invoices];
};

export default useDuplicateInvoice;
