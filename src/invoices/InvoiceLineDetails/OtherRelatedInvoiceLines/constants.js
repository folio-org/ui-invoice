import { FormattedMessage } from 'react-intl';

export const COLUMN_INVOICE_DATE = 'invoiceDate';

export const SORTABLE_FIELDS = [COLUMN_INVOICE_DATE];
export const DEFAULT_SORT_FIELD = COLUMN_INVOICE_DATE;
export const VISIBLE_COLUMNS = [
  'vendorInvoiceNo',
  'invoiceLine',
  COLUMN_INVOICE_DATE,
  'vendorName',
  'status',
  'quantity',
  'amount',
  'comment',
];

export const COLUMN_MAPPING = {
  invoiceLine: <FormattedMessage id="ui-invoice.otherRelatedInvoiceLines.invoiceLine" />,
  [COLUMN_INVOICE_DATE]: <FormattedMessage id="ui-invoice.otherRelatedInvoiceLines.invoiceDate" />,
  vendorName: <FormattedMessage id="ui-invoice.otherRelatedInvoiceLines.vendorName" />,
  vendorInvoiceNo: <FormattedMessage id="ui-invoice.otherRelatedInvoiceLines.vendorInvoiceNo" />,
  status: <FormattedMessage id="ui-invoice.otherRelatedInvoiceLines.status" />,
  quantity: <FormattedMessage id="ui-invoice.otherRelatedInvoiceLines.quantity" />,
  amount: <FormattedMessage id="ui-invoice.otherRelatedInvoiceLines.amount" />,
  comment: <FormattedMessage id="ui-invoice.otherRelatedInvoiceLines.comment" />,
};
