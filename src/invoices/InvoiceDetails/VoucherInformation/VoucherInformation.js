import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { stripesConnect } from '@folio/stripes/core';
import {
  Col,
  Headline,
  KeyValue,
  MultiColumnList,
  Row,
} from '@folio/stripes/components';
import { AmountWithCurrencyField } from '@folio/stripes-acq-components';

import { formatDate } from '../../../common/utils';

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
  const resultsFormatter = {
    amount: line => (
      <AmountWithCurrencyField
        amount={line.amount}
        currency={voucher.invoiceCurrency}
      />
    ),
  };

  return (
    <Fragment>
      <Row>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-invoice.invoice.details.voucher.status" />}
            value={voucher.status}
          />
        </Col>

        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-invoice.invoice.details.voucher.voucherNumber" />}
            value={voucher.voucherNumber}
          />
        </Col>

        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-invoice.invoice.details.voucher.voucherDate" />}
            value={formatDate(voucher.voucherDate)}
          />
        </Col>

        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-invoice.invoice.details.voucher.total" />}
          >
            <AmountWithCurrencyField
              amount={voucher.amount}
              currency={voucher.invoiceCurrency}
            />
          </KeyValue>
        </Col>
      </Row>

      <Row>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-invoice.invoice.details.voucher.exchangeRate" />}
            value={voucher.exchangeRate}
          />
        </Col>

        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-invoice.invoice.details.voucher.disbursementNumber" />}
            value={voucher.disbursementNumber}
          />
        </Col>

        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-invoice.invoice.details.voucher.disbursementDate" />}
            value={formatDate(voucher.disbursementDate)}
          />
        </Col>

        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-invoice.invoice.details.voucher.disbursementAmount" />}
          >
            <AmountWithCurrencyField
              amount={voucher.disbursementAmount}
              currency={voucher.invoiceCurrency}
            />
          </KeyValue>
        </Col>
      </Row>

      <Row>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-invoice.invoice.details.voucher.accountingCode" />}
            value={voucher.accountingCode}
          />
        </Col>
      </Row>

      <Headline
        margin="none"
        size="large"
      >
        <FormattedMessage id="ui-invoice.invoice.details.voucher.voucherLines" />
      </Headline>

      <MultiColumnList
        columnMapping={columnMapping}
        columnWidths={columnWidths}
        contentData={voucherLines}
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

export default stripesConnect(VoucherInformation);
