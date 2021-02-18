import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { useStripes } from '@folio/stripes/core';
import {
  Checkbox,
  Col,
  KeyValue,
  Row,
} from '@folio/stripes/components';
import {
  CurrencyValue,
  ExchangeRateValue,
  PAYMENT_METHOD_LABELS,
} from '@folio/stripes-acq-components';

const ExtendedInformation = ({
  folioInvoiceNo,
  paymentMethod,
  chkSubscriptionOverlap,
  exportToAccounting,
  currency,
  exchangeRate,
}) => {
  const stripes = useStripes();
  const isExchangeRateVisible = stripes.currency !== currency;

  return (
    <Row>
      <Col xs={3}>
        <KeyValue
          label={<FormattedMessage id="ui-invoice.invoice.folioInvoiceNo" />}
          value={folioInvoiceNo}
        />
      </Col>

      <Col xs={3}>
        <KeyValue
          label={<FormattedMessage id="ui-invoice.invoice.paymentMethod" />}
          value={PAYMENT_METHOD_LABELS[paymentMethod]}
        />
      </Col>

      <Col xs={3}>
        <Checkbox
          checked={chkSubscriptionOverlap}
          disabled
          label={<FormattedMessage id="ui-invoice.invoice.chkSubscriptionOverlap" />}
          type="checkbox"
          vertical
        />
      </Col>

      <Col xs={3}>
        <Checkbox
          checked={exportToAccounting}
          disabled
          label={<FormattedMessage id="ui-invoice.invoice.exportToAccounting" />}
          type="checkbox"
          vertical
        />
      </Col>

      <Col xs={3}>
        <CurrencyValue value={currency} />
      </Col>

      {isExchangeRateVisible && (
        <Col
          xs={3}
          data-testid="exchange-rate-value"
        >
          <ExchangeRateValue
            manualExchangeRate={exchangeRate}
            exchangeFrom={currency}
            exchangeTo={stripes.currency}
          />
        </Col>
      )}
    </Row>
  );
};

ExtendedInformation.propTypes = {
  folioInvoiceNo: PropTypes.string,
  paymentMethod: PropTypes.string,
  chkSubscriptionOverlap: PropTypes.bool,
  exportToAccounting: PropTypes.bool,
  currency: PropTypes.string,
  exchangeRate: PropTypes.number,
};

ExtendedInformation.defaultProps = {
  chkSubscriptionOverlap: false,
  exportToAccounting: false,
};

export default ExtendedInformation;
