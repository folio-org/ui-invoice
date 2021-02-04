import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import {
  Headline,
  MultiColumnList,
} from '@folio/stripes/components';
import {
  AmountWithCurrencyField,
  FolioFormattedDate,
} from '@folio/stripes-acq-components';

import { getInvoiceStatusLabel } from '../../utils';

const visibleColumns = [
  'vendorInvoiceNo',
  'invoiceDate',
  'vendorName',
  'status',
  'amount',
];
const columnMapping = {
  vendorInvoiceNo: <FormattedMessage id="ui-invoice.invoice.vendorInvoiceNo" />,
  invoiceDate: <FormattedMessage id="ui-invoice.invoice.details.information.invoiceDate" />,
  vendorName: <FormattedMessage id="ui-invoice.invoice.details.vendor.name" />,
  status: <FormattedMessage id="ui-invoice.invoice.details.information.status" />,
  amount: <FormattedMessage id="ui-invoice.invoice.duplicateInvoice.amount" />,
};

const resultsFormatter = {
  vendorInvoiceNo: invoice => (
    <Link
      data-test-link-to-invoice
      to={`/invoice/view/${invoice.id}`}
    >
      {invoice.vendorInvoiceNo}
    </Link>
  ),
  invoiceDate: invoice => <FolioFormattedDate value={invoice.invoiceDate} />,
  vendorName: invoice => invoice.vendor?.name,
  status: invoice => <FormattedMessage id={getInvoiceStatusLabel(invoice)} />,
  amount: invoice => (
    <AmountWithCurrencyField
      currency={invoice.currency}
      amount={invoice.total}
    />
  ),
};

const DuplicateInvoiceList = ({ invoices }) => {
  return (
    <>
      <Headline>
        <FormattedMessage id="ui-invoice.invoice.duplicateInvoice.title" />
      </Headline>
      <MultiColumnList
        id="duplicate-invoice-list"
        contentData={invoices}
        visibleColumns={visibleColumns}
        columnMapping={columnMapping}
        formatter={resultsFormatter}
        interactive={false}
      />
    </>
  );
};

DuplicateInvoiceList.propTypes = {
  invoices: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default DuplicateInvoiceList;
