import { VOUCHERS_API } from '../../../../src/common/constants/api';

const configVouchers = server => {
  server.get(VOUCHERS_API, (schema) => {
    return schema.vouchers.all();
  });
};

export default configVouchers;
