import { VOUCHER_NUMBER_START_API } from '../../../../src/common/constants/api';

const configVoucherLines = server => {
  server.get(VOUCHER_NUMBER_START_API, () => [{ sequenceNumber: 10 }]);
};

export default configVoucherLines;
