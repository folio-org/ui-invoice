import { useCallback, useRef } from 'react';
import moment from 'moment';

import {
  DATE_FORMAT,
  useShowCallout,
} from '@folio/stripes-acq-components';
import { useOkapiKy } from '@folio/stripes/core';

import { BATCH_VOUCHER_EXPORT_STATUS } from '../../../../common/constants';
import { createManualVoucherExport } from '../../utils';

const POLLING_PERIOD = 4000;

export const useManualExportRun = ({
  batchGroupId,
  batchGroups,
  batchVoucherExports,
  refetch,
}) => {
  const showCallout = useShowCallout();
  const ky = useOkapiKy();
  const timeOutId = useRef();

  const refreshList = useCallback(async (exportId) => {
    const { data } = await refetch();
    const updatedExport = data?.batchVoucherExports?.find(({ id }) => exportId === id);

    if (updatedExport?.status === BATCH_VOUCHER_EXPORT_STATUS.pending) {
      clearTimeout(timeOutId.current);
      timeOutId.current = setTimeout(() => refreshList(exportId), POLLING_PERIOD);
    }
  }, [refetch]);

  const runManualExport = useCallback(
    () => {
      const start = batchVoucherExports[0]?.end
        || batchGroups.find(({ id }) => id === batchGroupId)?.metadata?.createdDate
        || moment(0).tz('UTC').format(DATE_FORMAT);

      return createManualVoucherExport(ky, batchGroupId, start)
        .then(
          exportData => {
            showCallout({
              messageId: 'ui-invoice.settings.runManualExport.success',
              type: 'success',
            });

            return exportData;
          },
          () => showCallout({
            messageId: 'ui-invoice.settings.runManualExport.error',
            type: 'error',
          }),
        )
        .then(({ id }) => refreshList(id));
    },
    [
      batchVoucherExports,
      batchGroupId,
      batchGroups,
      ky,
      refreshList,
      showCallout,
    ],
  );

  return [runManualExport, () => clearTimeout(timeOutId.current)];
};
