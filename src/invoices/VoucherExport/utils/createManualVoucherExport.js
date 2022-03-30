import moment from 'moment';

import {
  BATCH_VOUCHER_EXPORTS_API,
  BATCH_VOUCHER_EXPORT_STATUS,
} from '../../../common/constants';

export const createManualVoucherExport = (ky, batchGroupId, start) => {
  const exportParams = {
    batchGroupId,
    start,
    end: moment.utc().format(),
    status: BATCH_VOUCHER_EXPORT_STATUS.pending,
  };

  return ky.post(BATCH_VOUCHER_EXPORTS_API, { json: exportParams }).json();
};
