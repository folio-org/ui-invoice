import PropTypes from 'prop-types';
import { FormattedDate, FormattedMessage } from 'react-intl';
import { Link, useLocation } from 'react-router-dom';

import {
  Accordion,
  Loading,
  NoValue,
} from '@folio/stripes/components';
import {
  AmountWithCurrencyField,
  FrontendSortingMCL,
  DESC_DIRECTION,
} from '@folio/stripes-acq-components';

import { SECTIONS_INVOICE_LINE } from '../../constants';
import { useOtherRelatedInvoiceLines } from './useOtherRelatedInvoiceLines';

const COLUMN_INVOICE_DATE = 'invoiceDate';
const visibleColumns = [
  'invoiceLine',
  COLUMN_INVOICE_DATE,
  'vendorName',
  'vendorInvoiceNo',
  'status',
  'quantity',
  'amount',
  'comment',
];
const columnMapping = {
  invoiceLine: <FormattedMessage id="ui-invoice.otherRelatedInvoiceLines.invoiceLine" />,
  [COLUMN_INVOICE_DATE]: <FormattedMessage id="ui-invoice.otherRelatedInvoiceLines.invoiceDate" />,
  vendorName: <FormattedMessage id="ui-invoice.otherRelatedInvoiceLines.vendorName" />,
  vendorInvoiceNo: <FormattedMessage id="ui-invoice.otherRelatedInvoiceLines.vendorInvoiceNo" />,
  status: <FormattedMessage id="ui-invoice.otherRelatedInvoiceLines.status" />,
  quantity: <FormattedMessage id="ui-invoice.otherRelatedInvoiceLines.quantity" />,
  amount: <FormattedMessage id="ui-invoice.otherRelatedInvoiceLines.amount" />,
  comment: <FormattedMessage id="ui-invoice.otherRelatedInvoiceLines.comment" />,
};
const sorters = {
  [COLUMN_INVOICE_DATE]: ({ invoice }) => invoice?.invoiceDate,
};

const getResultFormatter = ({ search }) => ({
  invoiceLine: invoiceLine => (
    <Link
      to={{
        pathname: `/invoice/view/${invoiceLine.invoice?.id}/line/${invoiceLine.id}/view`,
        search,
      }}
    >
      {`${invoiceLine.invoice?.folioInvoiceNo}-${invoiceLine.invoiceLineNumber}`}
    </Link>
  ),
  [COLUMN_INVOICE_DATE]: invoiceLine => <FormattedDate value={invoiceLine.invoice?.invoiceDate} />,
  vendorName: invoiceLine => invoiceLine.vendor?.name || <NoValue />,
  vendorInvoiceNo: invoiceLine => invoiceLine.invoice?.vendorInvoiceNo || <NoValue />,
  status: invoiceLine => (
    invoiceLine.invoiceLineStatus
      ? <FormattedMessage id={`ui-invoice.invoice.status.${invoiceLine.invoiceLineStatus.toLowerCase()}`} />
      : <NoValue />
  ),
  amount: invoiceLine => (
    <AmountWithCurrencyField
      currency={invoiceLine.invoice?.currency}
      amount={invoiceLine.total}
    />
  ),
  comment: invoiceLine => invoiceLine.comment || <NoValue />,
});

export const OtherRelatedInvoiceLines = ({ invoiceLine, poLine }) => {
  const location = useLocation();
  const { invoiceLines, isLoading } = useOtherRelatedInvoiceLines(invoiceLine?.id, poLine?.id);

  if (isLoading) return <Loading />;

  return (
    Boolean(invoiceLines.length) && (
      <Accordion
        id={SECTIONS_INVOICE_LINE.otherRelatedInvoiceLines}
        label={<FormattedMessage id="ui-invoice.otherRelatedInvoiceLines" />}
      >
        <FrontendSortingMCL
          columnMapping={columnMapping}
          contentData={invoiceLines}
          formatter={getResultFormatter(location)}
          id="otherRelatedInvoiceLines"
          interactive={false}
          sortDirection={DESC_DIRECTION}
          sortedColumn={COLUMN_INVOICE_DATE}
          sorters={sorters}
          visibleColumns={visibleColumns}
        />
      </Accordion>
    )
  );
};

OtherRelatedInvoiceLines.propTypes = {
  invoiceLine: PropTypes.object.isRequired,
  poLine: PropTypes.object.isRequired,
};
