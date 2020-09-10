import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { findIndex } from 'lodash';

import {
  Headline,
  MultiColumnList,
  NoValue,
  Row,
} from '@folio/stripes/components';
import { AmountWithCurrencyField } from '@folio/stripes-acq-components';

import {
  getTotalAmount,
  groupByExternalAccNumber,
} from './utils';

const visibleColumns = ['lineNumber', 'group', 'fundCode', 'externalAccountNumber', 'amount'];
const columnMapping = {
  lineNumber: <FormattedMessage id="ui-invoice.voucher.voucherLines.lineNumber" />,
  group: <FormattedMessage id="ui-invoice.voucher.voucherLines.group" />,
  fundCode: <FormattedMessage id="ui-invoice.voucher.voucherLines.fundCode" />,
  externalAccountNumber: <FormattedMessage id="ui-invoice.voucher.voucherLines.externalAccountNumber" />,
  amount: <FormattedMessage id="ui-invoice.voucher.voucherLines.amount" />,
};

const VoucherLinesDetails = ({ voucherLines, currency }) => {
  const groupedVoucherLines = groupByExternalAccNumber(voucherLines);

  return (
    Object.values(groupedVoucherLines).map(lines => {
      const externalAccountNumber = lines[0].externalAccountNumber;
      const resultsFormatter = {
        lineNumber: line => findIndex(lines, ['id', line.id]) + 1,
        fundCode: ({ fundDistributions }) => fundDistributions.map(({ code }) => code).join(', '),
        amount: line => (
          <AmountWithCurrencyField
            amount={line.amount}
            currency={currency}
          />
        ),
        group: () => <NoValue />,
      };

      return (
        <Fragment key={externalAccountNumber}>
          <Headline>
            <FormattedMessage
              id="ui-invoice.voucher.voucherLinesTitle.externalAccountNumber"
              values={{ externalAccountNumber }}
            />
          </Headline>

          <MultiColumnList
            columnMapping={columnMapping}
            contentData={lines}
            formatter={resultsFormatter}
            visibleColumns={visibleColumns}
          />

          <Row end="xs">
            <Headline>
              <FormattedMessage id="ui-invoice.voucher.voucherLines.total" />
              <AmountWithCurrencyField
                amount={getTotalAmount(lines)}
                currency={currency}
              />
            </Headline>
          </Row>
        </Fragment>
      );
    })
  );
};

VoucherLinesDetails.propTypes = {
  voucherLines: PropTypes.arrayOf(PropTypes.object).isRequired,
  currency: PropTypes.string.isRequired,
};

export default VoucherLinesDetails;
