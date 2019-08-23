import { Response } from '@bigtest/mirage';

import { INVOICE_LINE_API } from '../../../../src/common/constants';

const configLines = server => {
  server.get(INVOICE_LINE_API, (schema) => {
    return schema.lines.all();
  });

  server.post(INVOICE_LINE_API, (schema, request) => {
    const attrs = JSON.parse(request.requestBody) || {};

    return schema.lines.create(attrs);
  });

  server.put(`${INVOICE_LINE_API}/:id`, (schema, request) => {
    const id = request.params.id;
    const attrs = JSON.parse(request.requestBody);

    schema.lines.find(id).update(attrs);

    return null;
  });

  server.get(`${INVOICE_LINE_API}/:id`, (schema, request) => {
    const invoiceLineSchema = schema.lines.find(request.params.id);

    if (!invoiceLineSchema) {
      return new Response(404, {
        'X-Okapi-Token': `myOkapiToken:${Date.now()}`,
      }, {});
    }

    return invoiceLineSchema.attrs;
  });

  server.delete(`${INVOICE_LINE_API}/:id`, 'line');
};

export default configLines;
