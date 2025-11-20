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
  chkSubscriptionOverlap = false,
  currency,
  enclosureNeeded = false,
  exchangeRate,
  exportToAccounting = false,
  folioInvoiceNo,
  paymentMethod,
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
        <Checkbox
          checked={enclosureNeeded}
          disabled
          label={<FormattedMessage id="ui-invoice.invoice.enclosureNeeded" />}
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
  chkSubscriptionOverlap: PropTypes.bool,
  currency: PropTypes.string,
  enclosureNeeded: PropTypes.bool,
  exchangeRate: PropTypes.number,
  exportToAccounting: PropTypes.bool,
  folioInvoiceNo: PropTypes.string,
  paymentMethod: PropTypes.string,
};

export default ExtendedInformation;
