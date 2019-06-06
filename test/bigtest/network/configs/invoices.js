import { INVOICES_LIST_API } from '../../../../src/common/constants';

const configInvoices = server => {
  server.get(INVOICES_LIST_API, (schema) => {
    return schema.invoices.all();
  });
};

export default configInvoices;
