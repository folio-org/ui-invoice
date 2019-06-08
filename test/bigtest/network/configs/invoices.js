import { INVOICE_API } from '../../../../src/common/constants';

const configInvoices = server => {
  server.get(INVOICE_API, (schema) => {
    return schema.invoices.all();
  });

  server.get(`${INVOICE_API}/:id`, (schema, request) => {
    return schema.invoices.find(request.params.id).attrs;
  });
};

export default configInvoices;
