import React from 'react';
import { FormattedMessage } from 'react-intl';

export const BATCH_VOUCHER_EXPORT_STATUS = {
  pending: 'Pending',
  generated: 'Generated',
  uploaded: 'Uploaded',
  error: 'Error',
};

export const BATCH_VOUCHER_EXPORT_STATUS_LABEL = {
  [BATCH_VOUCHER_EXPORT_STATUS.pending]: <FormattedMessage id="ui-invoice.settings.BatchVoucherExports.status.pending" />,
  [BATCH_VOUCHER_EXPORT_STATUS.generated]: <FormattedMessage id="ui-invoice.settings.BatchVoucherExports.status.generated" />,
  [BATCH_VOUCHER_EXPORT_STATUS.uploaded]: <FormattedMessage id="ui-invoice.settings.BatchVoucherExports.status.uploaded" />,
  [BATCH_VOUCHER_EXPORT_STATUS.error]: <FormattedMessage id="ui-invoice.settings.BatchVoucherExports.status.error" />,
};
