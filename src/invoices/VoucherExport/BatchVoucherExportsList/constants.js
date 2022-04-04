import { FormattedMessage } from 'react-intl';

export const BV_EXPORT_LIST_COLUMNS = [
  'date',
  'status',
  'message',
  'exportButton',
];

export const BV_EXPORT_COLUMN_MAPPING = {
  date: <FormattedMessage id="ui-invoice.settings.BatchVoucherExports.date" />,
  status: <FormattedMessage id="ui-invoice.settings.BatchVoucherExports.status" />,
  message: <FormattedMessage id="ui-invoice.settings.BatchVoucherExports.message" />,
  exportButton: ' ',
};

export const BV_EXPORT_SORTABLE_COLUMNS = ['date'];
export const BV_EXPORT_NON_INTERACTIVE_COLUMNS = ['status', 'message', 'exportButton'];

export const ROW_PROPS = { alignLastColToEnd: true };
