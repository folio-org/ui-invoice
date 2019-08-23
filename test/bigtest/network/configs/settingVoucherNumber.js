import { VOUCHER_NUMBER_START_API } from '../../../../src/common/constants/api';

const configVoucherLines = server => {
  server.get(VOUCHER_NUMBER_START_API, () => [{ sequenceNumber: '10' }]);
  server.post(`${VOUCHER_NUMBER_START_API}/:startNumber`, (schema, request) => {
    const { params: { startNumber } } = request;

    server.get(VOUCHER_NUMBER_START_API, () => [{ sequenceNumber: startNumber }]);
  });
};

export default configVoucherLines;
