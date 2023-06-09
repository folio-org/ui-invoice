import { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedDate, FormattedMessage } from 'react-intl';
import { Link, useLocation, useHistory } from 'react-router-dom';

import { ClipCopy } from '@folio/stripes/smart-components';
import {
  Accordion,
  Loading,
  NoValue,
  MultiColumnList,
} from '@folio/stripes/components';

import {
  AmountWithCurrencyField,
  RESULT_COUNT_INCREMENT,
  PrevNextPagination,
  useLocationSorting,
} from '@folio/stripes-acq-components';

import { SECTIONS_INVOICE_LINE } from '../../constants';
import { useOtherRelatedInvoiceLines } from './useOtherRelatedInvoiceLines';

const resetData = () => {};

const COLUMN_INVOICE_DATE = 'invoiceDate';
const sortableFields = [COLUMN_INVOICE_DATE];
const visibleColumns = [
  'vendorInvoiceNo',
  'invoiceLine',
  COLUMN_INVOICE_DATE,
  'vendorName',
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

const getResultFormatter = ({ search }) => ({
  invoiceLine: invoiceLine => (
    <Link
      to={{
        pathname: `/invoice/view/${invoiceLine.invoice?.id}/line/${invoiceLine.id}/view`,
        search,
      }}
    >
      {`${invoiceLine.invoiceLineNumber}`}
    </Link>
  ),
  [COLUMN_INVOICE_DATE]: invoiceLine => <FormattedDate value={invoiceLine.invoice?.invoiceDate} />,
  vendorName: invoiceLine => invoiceLine.vendor?.name || <NoValue />,
  vendorInvoiceNo: invoiceLine => (
    invoiceLine.invoice?.vendorInvoiceNo
      ? (
        <>
          {invoiceLine.invoice.vendorInvoiceNo}
          <ClipCopy text={invoiceLine.invoice.vendorInvoiceNo} />
        </>
      )
      : <NoValue />
  ),
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
  const history = useHistory();
  const [pagination, setPagination] = useState({ limit: RESULT_COUNT_INCREMENT, offset: 0 });
  const [
    sortingField,
    sortingDirection,
    changeSorting,
  ] = useLocationSorting(location, history, resetData, sortableFields);
  const { invoiceLines, isLoading, totalInvoiceLines, isFetching } = useOtherRelatedInvoiceLines({
    invoiceLineId: invoiceLine.id,
    poLineId: poLine.id,
    pagination,
  });

  if (isLoading) return <Loading />;

  return (
    Boolean(invoiceLines.length) && (
      <Accordion
        id={SECTIONS_INVOICE_LINE.otherRelatedInvoiceLines}
        label={<FormattedMessage id="ui-invoice.otherRelatedInvoiceLines" />}
      >
        <MultiColumnList
          columnMapping={columnMapping}
          contentData={invoiceLines}
          formatter={getResultFormatter(location)}
          id="otherRelatedInvoiceLines"
          interactive={false}
          isLoading={isFetching}
          sortOrder={sortingField}
          sortDirection={sortingDirection}
          onHeaderClick={changeSorting}
          visibleColumns={visibleColumns}
        />
        <PrevNextPagination
          {...pagination}
          totalCount={totalInvoiceLines}
          onChange={setPagination}
          disabled={false}
        />
      </Accordion>
    )
  );
};

OtherRelatedInvoiceLines.propTypes = {
  invoiceLine: PropTypes.object.isRequired,
  poLine: PropTypes.object.isRequired,
};
