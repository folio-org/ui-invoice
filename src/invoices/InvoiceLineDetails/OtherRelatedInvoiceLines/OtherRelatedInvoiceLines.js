import { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedDate, FormattedMessage } from 'react-intl';
import { Link, useLocation } from 'react-router-dom';
import { ClipCopy } from '@folio/stripes/smart-components';
import {
  Accordion,
  Loading,
  NoValue,
  DESC_DIRECTION,
} from '@folio/stripes/components';

import {
  AmountWithCurrencyField,
  RESULT_COUNT_INCREMENT,
  PrevNextPagination,
  FrontendSortingMCL,
} from '@folio/stripes-acq-components';

import { SECTIONS_INVOICE_LINE } from '../../constants';
import { useOtherRelatedInvoiceLines } from './useOtherRelatedInvoiceLines';
import { useFrontendPaginatedData } from '../../../common/hooks/useFrontendPaginatedData';
import {
  COLUMN_INVOICE_DATE,
  COLUMN_MAPPING,
  DEFAULT_SORT_FIELD,
  VISIBLE_COLUMNS,
} from './constants';

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
  const [pagination, setPagination] = useState({ limit: RESULT_COUNT_INCREMENT, offset: 0 });
  const { invoiceLines, isLoading, totalInvoiceLines } = useOtherRelatedInvoiceLines(invoiceLine.id, poLine.id);
  const paginatedInvoiceLines = useFrontendPaginatedData(invoiceLines, pagination);

  if (isLoading) return <Loading />;

  return (
    Boolean(invoiceLines?.length) && (
      <Accordion
        id={SECTIONS_INVOICE_LINE.otherRelatedInvoiceLines}
        label={<FormattedMessage id="ui-invoice.otherRelatedInvoiceLines" />}
      >
        <FrontendSortingMCL
          columnMapping={COLUMN_MAPPING}
          contentData={paginatedInvoiceLines}
          formatter={getResultFormatter(location)}
          id="otherRelatedInvoiceLines"
          interactive={false}
          sortDirection={DESC_DIRECTION}
          sortedColumn={DEFAULT_SORT_FIELD}
          sorters={sorters}
          visibleColumns={VISIBLE_COLUMNS}
          isEndOfListHidden
        />
        {invoiceLines.length > 0 && (
        <PrevNextPagination
          {...pagination}
          totalCount={totalInvoiceLines}
          onChange={setPagination}
          disabled={false}
        />)}
      </Accordion>
    )
  );
};

OtherRelatedInvoiceLines.propTypes = {
  invoiceLine: PropTypes.object.isRequired,
  poLine: PropTypes.object.isRequired,
};
