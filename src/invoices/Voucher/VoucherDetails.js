import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  KeyValue,
  NoValue,
  Row,
} from '@folio/stripes/components';
import { AmountWithCurrencyField } from '@folio/stripes-acq-components';

import { formatDate } from '../../common/utils';

const VoucherDetails = ({ voucher }) => (
  <>
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
          value={voucher.voucherDate ? formatDate(voucher.voucherDate) : <NoValue />}
        />
      </Col>

      <Col xs={3}>
        <KeyValue
          label={<FormattedMessage id="ui-invoice.invoice.details.voucher.total" />}
        >
          <AmountWithCurrencyField
            amount={voucher.amount}
            currency={voucher.systemCurrency}
          />
        </KeyValue>
      </Col>
    </Row>

    <Row>
      <Col xs={3}>
        <KeyValue
          label={<FormattedMessage id="ui-invoice.invoice.details.voucher.exchangeRate" />}
          value={voucher.exchangeRate ?? <NoValue />}
        />
      </Col>

      <Col xs={3}>
        <KeyValue
          label={<FormattedMessage id="ui-invoice.invoice.details.voucher.disbursementNumber" />}
          value={voucher.disbursementNumber || <NoValue />}
        />
      </Col>

      <Col xs={3}>
        <KeyValue
          label={<FormattedMessage id="ui-invoice.invoice.details.voucher.disbursementDate" />}
          value={voucher.disbursementDate ? formatDate(voucher.disbursementDate) : <NoValue />}
        />
      </Col>

      <Col xs={3}>
        <KeyValue
          label={<FormattedMessage id="ui-invoice.invoice.details.voucher.disbursementAmount" />}
        >
          <AmountWithCurrencyField
            amount={voucher.disbursementAmount}
            currency={voucher.systemCurrency}
          />
        </KeyValue>
      </Col>
    </Row>

    <Row>
      <Col xs={3}>
        <KeyValue
          label={<FormattedMessage id="ui-invoice.invoice.details.voucher.accountingCode" />}
          value={voucher.accountingCode || <NoValue />}
        />
      </Col>
    </Row>
  </>
);

VoucherDetails.propTypes = {
  voucher: PropTypes.object.isRequired,
};

export default VoucherDetails;
