import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Checkbox,
  Col,
  KeyValue,
  Row,
} from '@folio/stripes/components';
import { ViewMetaData } from '@folio/stripes/smart-components';
import { AmountWithCurrencyField } from '@folio/stripes-acq-components';

import {
  getInvoiceStatusLabel,
  formatDate,
} from '../../common/utils';

const InvoiceLineInformation = ({ invoiceLine, currency, poLineNumber }) => {
  const metadata = invoiceLine.metadata;

  return (
    <>
      {metadata && <ViewMetaData metadata={metadata} />}
      <Row>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-invoice.invoiceLine.description" />}
            value={invoiceLine.description}
          />
        </Col>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-invoice.invoiceLine.invoiceLineNumber" />}
            value={invoiceLine.invoiceLineNumber}
          />
        </Col>
        <Col xs={3}>
          <KeyValue label={<FormattedMessage id="ui-invoice.invoiceLine.invoiceLineStatus" />}>
            <FormattedMessage id={getInvoiceStatusLabel({ status: invoiceLine.invoiceLineStatus })} />
          </KeyValue>
        </Col>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-invoice.invoiceLine.poLineNumber" />}
            value={poLineNumber}
          />
        </Col>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-invoice.invoiceLine.subscriptionInfo" />}
            value={invoiceLine.subscriptionInfo}
          />
        </Col>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-invoice.invoiceLine.subscriptionStart" />}
            value={formatDate(invoiceLine.subscriptionStart)}
          />
        </Col>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-invoice.invoiceLine.subscriptionEnd" />}
            value={formatDate(invoiceLine.subscriptionEnd)}
          />
        </Col>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-invoice.invoiceLine.quantity" />}
            value={invoiceLine.quantity}
          />
        </Col>
        <Col xs={3}>
          <KeyValue label={<FormattedMessage id="ui-invoice.invoiceLine.subTotal" />}>
            <AmountWithCurrencyField
              amount={invoiceLine.subTotal}
              currency={currency}
            />
          </KeyValue>
        </Col>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-invoice.invoiceLine.vendorRefNo" />}
            value={invoiceLine.vendorRefNo}
          />
        </Col>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-invoice.invoiceLine.accountNumber" />}
            value={invoiceLine.accountNumber}
          />
        </Col>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-invoice.invoiceLine.accountingCode" />}
            value={invoiceLine.accountingCode}
          />
        </Col>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-invoice.invoiceLine.comment" />}
            value={invoiceLine.comment}
          />
        </Col>
        <Col xs={3}>
          <KeyValue label={<FormattedMessage id="ui-invoice.invoiceLine.releaseEncumbrance" />}>
            <Checkbox
              checked={Boolean(invoiceLine.releaseEncumbrance)}
              disabled
              type="checkbox"
            />
          </KeyValue>
        </Col>
      </Row>
    </>
  );
};

InvoiceLineInformation.propTypes = {
  invoiceLine: PropTypes.object,
  currency: PropTypes.string,
  poLineNumber: PropTypes.string,
};

InvoiceLineInformation.defaultProps = {
  invoiceLine: {},
  poLineNumber: '',
};

export default InvoiceLineInformation;
