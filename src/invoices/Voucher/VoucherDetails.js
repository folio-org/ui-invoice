import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  KeyValue,
  NoValue,
  Row,
} from '@folio/stripes/components';
import {
  AmountWithCurrencyField,
  FolioFormattedDate,
} from '@folio/stripes-acq-components';

import { VoucherNumberValue } from '../../common/components/VoucherNumber';

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
        <VoucherNumberValue
          labelId="ui-invoice.invoice.details.voucher.voucherNumber"
          value={voucher.voucherNumber}
        />
      </Col>

      <Col xs={3}>
        <KeyValue
          label={<FormattedMessage id="ui-invoice.invoice.details.voucher.voucherDate" />}
          value={<FolioFormattedDate value={voucher.voucherDate} />}
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
          value={<FolioFormattedDate value={voucher.disbursementDate} />}
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
