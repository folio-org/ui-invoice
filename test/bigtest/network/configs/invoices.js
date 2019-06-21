import { Response } from '@bigtest/mirage';

import { INVOICE_API } from '../../../../src/common/constants';

const configInvoices = server => {
  server.get(INVOICE_API, (schema) => {
    return schema.invoices.all();
  });

  server.post(INVOICE_API, (schema, request) => {
    const attrs = JSON.parse(request.requestBody) || {};
    const { id, status, vendorInvoiceNo, paymentMethod, currency, source, invoiceDate, vendorId } = attrs;

    if (!(id && status && vendorInvoiceNo && paymentMethod && currency && source && invoiceDate && vendorId)) {
      return new Response(400, {
        'X-Okapi-Token': `myOkapiToken:${Date.now()}`,
      }, {});
    }

    return schema.invoices.create(attrs);
  });

  server.put(`${INVOICE_API}/:id`, () => null);

  server.get(`${INVOICE_API}/:id`, (schema, request) => {
    return schema.invoices.find(request.params.id).attrs;
  });
};

export default configInvoices;
