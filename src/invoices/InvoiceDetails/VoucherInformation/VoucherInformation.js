import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Headline,
  MultiColumnList,
} from '@folio/stripes/components';
import { AmountWithCurrencyField } from '@folio/stripes-acq-components';

import VoucherDetails from '../../Voucher/VoucherDetails';
import {
  groupByExternalAccNumber,
  getTotalAmount,
} from '../../Voucher/utils';

const visibleColumns = ['externalAccountNumber', 'amount'];
const columnMapping = {
  externalAccountNumber: <FormattedMessage id="ui-invoice.invoice.details.voucher.externalAccountNumber" />,
  amount: <FormattedMessage id="ui-invoice.invoice.details.voucher.amount" />,
};
const columnWidths = {
  externalAccountNumber: '50%',
  amount: '50%',
};

const VoucherInformation = ({ voucher, voucherLines = [] }) => {
  const groupedVoucherLines = groupByExternalAccNumber(voucherLines);
  const linesWithTotalAmount = Object.values(groupedVoucherLines).map(lines => ({
    totalAmount: getTotalAmount(lines),
    externalAccountNumber: lines[0].externalAccountNumber,
  }));

  const resultsFormatter = {
    amount: line => (
      <AmountWithCurrencyField
        amount={line.totalAmount}
        currency={voucher.invoiceCurrency}
      />
    ),
  };

  return (
    <Fragment>
      <VoucherDetails voucher={voucher} />

      <Headline
        margin="none"
        size="large"
      >
        <FormattedMessage id="ui-invoice.invoice.details.voucher.voucherLines" />
      </Headline>

      <MultiColumnList
        columnMapping={columnMapping}
        columnWidths={columnWidths}
        contentData={linesWithTotalAmount}
        formatter={resultsFormatter}
        visibleColumns={visibleColumns}
      />
    </Fragment>
  );
};

VoucherInformation.propTypes = {
  voucher: PropTypes.object.isRequired,
  voucherLines: PropTypes.arrayOf(PropTypes.object),
};

export default VoucherInformation;
