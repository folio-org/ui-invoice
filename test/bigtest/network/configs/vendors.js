import { VENDORS_API } from '../../../../src/common/constants';

const configVendors = server => {
  server.get(VENDORS_API, (schema) => {
    return schema.vendors.all();
  });
};

export default configVendors;
