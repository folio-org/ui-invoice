import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { saveAs } from 'file-saver';

import {
  IfPermission,
  stripesShape,
  withStripes,
} from '@folio/stripes/core';
import { IconButton } from '@folio/stripes/components';
import { useShowCallout } from '@folio/stripes-acq-components';

import { BATCH_VOUCHERS_API } from '../../../common/constants';
import {
  EXPORT_FORMAT_FILE_EXTENSION,
  EXPORT_FORMATS_HEADER_MAP,
} from '../constants';

const ExportVoucherButton = ({ batchVoucherId, format, stripes, fileName }) => {
  const showCallout = useShowCallout();
  const downloadBatchVouchers = useCallback(
    async () => {
      try {
        const httpHeaders = {
          'Accept': EXPORT_FORMATS_HEADER_MAP[format],
          'X-Okapi-Tenant': stripes.okapi.tenant,
          'X-Okapi-Token': stripes.okapi.token,
        };

        const batchVouchers = await fetch(
          `${stripes.okapi.url}/${BATCH_VOUCHERS_API}/${batchVoucherId}`,
          { headers: httpHeaders },
        );

        if (batchVouchers.status >= 400) {
          throw new Error();
        } else {
          const blob = await batchVouchers.blob();

          saveAs(blob, `${fileName}.${EXPORT_FORMAT_FILE_EXTENSION[format]}`);

          showCallout({
            messageId: 'ui-invoice.voucherExport.download.success',
          });
        }
      } catch (e) {
        showCallout({
          messageId: 'ui-invoice.settings.BatchVoucherExports.download.error',
          type: 'error',
        });
      }
    },
    [batchVoucherId, format, showCallout, stripes.okapi.tenant, stripes.okapi.token, stripes.okapi.url, fileName],
  );

  if (!batchVoucherId) {
    return null;
  }

  return (
    <IfPermission perm="batch-voucher.batch-vouchers.item.get">
      <IconButton
        data-test-batch-voucher-export-download
        icon="download"
        onClick={downloadBatchVouchers}
      />
    </IfPermission>
  );
};

ExportVoucherButton.propTypes = {
  batchVoucherId: PropTypes.string,
  fileName: PropTypes.string,
  format: PropTypes.string,
  stripes: stripesShape,
};

export default withStripes(ExportVoucherButton);
