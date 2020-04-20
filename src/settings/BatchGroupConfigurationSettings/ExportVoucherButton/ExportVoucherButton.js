import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import saveAs from 'file-saver';

import {
  stripesConnect,
  stripesShape,
} from '@folio/stripes/core';
import { IconButton } from '@folio/stripes/components';
import { useShowCallout } from '@folio/stripes-acq-components';

import { BATCH_VOUCHERS_API } from '../../../common/constants';
import { EXPORT_FORMATS_HEADER_MAP } from '../constants';

const ExportVoucherButton = ({ batchVoucherId, format, stripes }) => {
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

          saveAs(blob, batchVoucherId);
        }
      } catch (e) {
        showCallout({
          messageId: 'ui-invoice.settings.BatchVoucherExports.download.error',
          type: 'error',
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [batchVoucherId, format],
  );

  if (!batchVoucherId) {
    return null;
  }

  return (
    <IconButton
      data-test-batch-voucher-export-download
      icon="download"
      onClick={downloadBatchVouchers}
    />
  );
};

ExportVoucherButton.propTypes = {
  batchVoucherId: PropTypes.string,
  format: PropTypes.string,
  stripes: stripesShape,
};

export default stripesConnect(ExportVoucherButton);
