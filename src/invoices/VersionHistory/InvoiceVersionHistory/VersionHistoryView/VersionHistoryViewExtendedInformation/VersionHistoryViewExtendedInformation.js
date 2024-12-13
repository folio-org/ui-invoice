import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { useStripes } from '@folio/stripes/core';
import {
  Col,
  Row,
} from '@folio/stripes/components';
import {
  PAYMENT_METHOD_LABELS,
  VersionKeyValue,
  VersionCheckbox,
} from '@folio/stripes-acq-components';

export const VersionHistoryViewExtendedInformation = ({ version }) => {
  const {
    folioInvoiceNo,
    paymentMethod,
    currency,
    chkSubscriptionOverlap,
    exportToAccounting,
    enclosureNeeded,
    exchangeRate,
  } = version;

  const stripes = useStripes();
  const isExchangeRateVisible = stripes.currency !== currency;

  return (
    <Row>
      <Col xs={3}>
        <VersionKeyValue
          name="folioInvoiceNo"
          label={<FormattedMessage id="ui-invoice.invoice.folioInvoiceNo" />}
          value={folioInvoiceNo}
        />
      </Col>

      <Col xs={3}>
        <VersionKeyValue
          name="paymentMethod"
          label={<FormattedMessage id="ui-invoice.invoice.paymentMethod" />}
          value={PAYMENT_METHOD_LABELS[paymentMethod]}
        />
      </Col>

      <Col xs={3}>
        <VersionCheckbox
          checked={Boolean(chkSubscriptionOverlap)}
          disabled
          label={<FormattedMessage id="ui-invoice.invoice.chkSubscriptionOverlap" />}
          type="checkbox"
          name="chkSubscriptionOverlap"
        />
      </Col>

      <Col xs={3}>
        <VersionCheckbox
          checked={Boolean(exportToAccounting)}
          disabled
          label={<FormattedMessage id="ui-invoice.invoice.exportToAccounting" />}
          type="checkbox"
          name="exportToAccounting"
        />
      </Col>

      <Col xs={3}>
        <VersionCheckbox
          checked={Boolean(enclosureNeeded)}
          disabled
          label={<FormattedMessage id="ui-invoice.invoice.enclosureNeeded" />}
          type="checkbox"
          name="enclosureNeeded"
        />
      </Col>

      <Col xs={3}>
        <VersionKeyValue
          name="currency"
          label={<FormattedMessage id="ui-invoice.invoice.currency" />}
          value={currency}
        />
      </Col>

      {isExchangeRateVisible && (
        <Col
          xs={3}
        >
          <VersionKeyValue
            name="exchangeRate"
            label={<FormattedMessage id="ui-invoice.invoice.details.voucher.exchangeRate" />}
            value={exchangeRate}
          />
        </Col>
      )}
    </Row>
  );
};

VersionHistoryViewExtendedInformation.propTypes = {
  version: PropTypes.object.isRequired,
};
