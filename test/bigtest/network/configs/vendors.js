import { VENDORS_API } from '../../../../src/common/constants';

const configVendors = server => {
  server.get(VENDORS_API, (schema) => {
    return schema.vendors.all();
  });

  server.get(`${VENDORS_API}/:id`, (schema, request) => {
    return schema.vendors.find(request.params.id).attrs;
  });
};

export default configVendors;
