import PropTypes from 'prop-types';
import { FormattedDate, FormattedMessage } from 'react-intl';
import { Link, useLocation } from 'react-router-dom';

import { ClipCopy } from '@folio/stripes/smart-components';
import {
  Accordion,
  Loading,
  NoValue,
} from '@folio/stripes/components';
import {
  AmountWithCurrencyField,
  PrevNextPagination,
  FrontendSortingMCL,
  useLocalPagination,
  DESC_DIRECTION,
  RESULT_COUNT_INCREMENT,
} from '@folio/stripes-acq-components';

import { SECTIONS_INVOICE_LINE } from '../../constants';
import { useOtherRelatedInvoiceLines } from './useOtherRelatedInvoiceLines';
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
      {`${invoiceLine?.invoiceLineNumber}`}
    </Link>
  ),
  fiscalYear: invoiceLine => invoiceLine.fiscalYear?.code || <NoValue />,
  [COLUMN_INVOICE_DATE]: invoiceLine => <FormattedDate value={invoiceLine.invoice?.invoiceDate} />,
  vendorCode: invoiceLine => invoiceLine.vendor?.code || <NoValue />,
  subscriptionStart: invoiceLine => <FormattedDate value={invoiceLine.subscriptionStart} />,
  subscriptionEnd: invoiceLine => <FormattedDate value={invoiceLine.subscriptionEnd} />,
  subscriptionDescription: invoiceLine => invoiceLine.subscriptionInfo || <NoValue />,
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
  const { invoiceLines, isLoading, totalInvoiceLines } = useOtherRelatedInvoiceLines(invoiceLine.id, poLine.id);
  const { paginatedData, pagination, setPagination } = useLocalPagination(invoiceLines, RESULT_COUNT_INCREMENT);

  if (isLoading) return <Loading />;

  return (
    Boolean(invoiceLines?.length) && (
      <Accordion
        id={SECTIONS_INVOICE_LINE.otherRelatedInvoiceLines}
        label={<FormattedMessage id="ui-invoice.otherRelatedInvoiceLines" />}
      >
        <FrontendSortingMCL
          columnMapping={COLUMN_MAPPING}
          contentData={paginatedData}
          formatter={getResultFormatter(location)}
          id="otherRelatedInvoiceLines"
          interactive={false}
          sortDirection={DESC_DIRECTION}
          sortedColumn={DEFAULT_SORT_FIELD}
          sorters={sorters}
          visibleColumns={VISIBLE_COLUMNS}
          hasPagination
        />
        {invoiceLines.length > 0 && (
          <PrevNextPagination
            {...pagination}
            totalCount={totalInvoiceLines}
            onChange={setPagination}
            disabled={false}
          />
        )}
      </Accordion>
    )
  );
};

OtherRelatedInvoiceLines.propTypes = {
  invoiceLine: PropTypes.object.isRequired,
  poLine: PropTypes.object.isRequired,
};
