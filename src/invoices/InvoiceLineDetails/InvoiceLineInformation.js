import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  KeyValue,
  Row,
} from '@folio/stripes/components';
import { ViewMetaData } from '@folio/stripes/smart-components';

import {
  getInvoiceStatusLabel,
  formatAmount,
  formatDate,
} from '../../common/utils';

const InvoiceLineInformation = ({ invoiceLine }) => {
  const metadata = invoiceLine.metadata;

  return (
    <Fragment>
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
            label={<FormattedMessage id="ui-invoice.invoiceLine.poLineId" />}
            value={invoiceLine.poLineId}
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
          <KeyValue
            label={<FormattedMessage id="ui-invoice.invoiceLine.subTotal" />}
            value={formatAmount(invoiceLine.subTotal)}
          />
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
          <KeyValue
            label={<FormattedMessage id="ui-invoice.invoiceLine.releaseEncumbrance" />}
            value={invoiceLine.releaseEncumbrance}
          />
        </Col>
      </Row>
    </Fragment>
  );
};

InvoiceLineInformation.propTypes = {
  invoiceLine: PropTypes.object,
};

InvoiceLineInformation.defaultProps = {
  invoiceLine: {},
};

export default InvoiceLineInformation;
