import { VOUCHER_LINES_API } from '../../../../src/common/constants/api';

const configVoucherLines = server => {
  server.get(VOUCHER_LINES_API, (schema) => {
    return schema.voucherLines.all();
  });
};

export default configVoucherLines;
