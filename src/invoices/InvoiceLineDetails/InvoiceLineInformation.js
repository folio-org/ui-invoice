import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Checkbox,
  Col,
  KeyValue,
  NoValue,
  Row,
  TextLink,
} from '@folio/stripes/components';
import {
  ClipCopy,
  ViewMetaData,
} from '@folio/stripes/smart-components';
import {
  AmountWithCurrencyField,
  FolioFormattedDate,
  VendorReferenceNumbersDetails,
} from '@folio/stripes-acq-components';

import { CalculatedExchangeAmount } from '../../common/components';

const InvoiceLineInformation = ({
  currency,
  exchangeRate,
  invoiceLine,
  poLine,
}) => {
  const metadata = invoiceLine?.metadata;

  return (
    <>
      {metadata && <ViewMetaData metadata={metadata} />}
      <Row>
        <Col xs={12}>
          <KeyValue
            label={<FormattedMessage id="ui-invoice.invoiceLine.description" />}
            value={invoiceLine?.description}
          />
        </Col>
        <Col xs={3}>
          <KeyValue label={<FormattedMessage id="ui-invoice.invoiceLine.poLineNumber" />}>
            {poLine?.id
              ? (
                <>
                  <TextLink
                    rel="noopener noreferrer"
                    target="_blank"
                    to={`/orders/lines/view/${poLine.id}`}
                  >
                    {poLine.poLineNumber}
                  </TextLink>
                  <ClipCopy text={poLine.poLineNumber} />
                </>
              )
              : <NoValue />
            }
          </KeyValue>
        </Col>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-invoice.invoiceLine.invoiceLineNumber" />}
            value={invoiceLine?.invoiceLineNumber}
          />
        </Col>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-invoice.invoice.details.information.status" />}
            value={invoiceLine?.invoiceLineStatus}
          />
        </Col>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-invoice.invoiceLine.subscriptionInfo" />}
            value={invoiceLine?.subscriptionInfo}
          />
        </Col>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-invoice.invoiceLine.subscriptionStart" />}
            value={<FolioFormattedDate value={invoiceLine?.subscriptionStart} />}
          />
        </Col>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-invoice.invoiceLine.subscriptionEnd" />}
            value={<FolioFormattedDate value={invoiceLine?.subscriptionEnd} />}
          />
        </Col>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-invoice.invoiceLine.comment" />}
            value={invoiceLine?.comment}
          />
        </Col>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-invoice.invoiceLine.accountNumber" />}
            value={invoiceLine?.accountNumber}
          />
        </Col>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-invoice.invoice.accountingCode" />}
            value={invoiceLine?.accountingCode}
          />
        </Col>
        <Col xs={3}>
          <KeyValue label={<FormattedMessage id="ui-invoice.invoiceLine.subTotal" />}>
            <AmountWithCurrencyField
              amount={invoiceLine?.subTotal}
              currency={currency}
            />
          </KeyValue>
        </Col>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-invoice.invoiceLine.quantity" />}
            value={invoiceLine?.quantity}
          />
        </Col>
        <Col xs={3}>
          <CalculatedExchangeAmount
            currency={currency}
            exchangeRate={exchangeRate}
            label={<FormattedMessage id="ui-invoice.invoice.details.lines.list.total.exchanged" />}
            total={invoiceLine?.total}
          />
        </Col>
        <Col xs={3}>
          <Checkbox
            checked={Boolean(invoiceLine?.releaseEncumbrance)}
            disabled
            label={<FormattedMessage id="ui-invoice.invoiceLine.releaseEncumbrance" />}
            type="checkbox"
            vertical
          />
        </Col>
        <Col xs={12}>
          <KeyValue
            label={<FormattedMessage id="ui-invoice.invoiceLine.referenceNumbers" />}
          >
            <VendorReferenceNumbersDetails referenceNumbers={invoiceLine?.referenceNumbers} />
          </KeyValue>
        </Col>
      </Row>
    </>
  );
};

InvoiceLineInformation.propTypes = {
  currency: PropTypes.string,
  exchangeRate: PropTypes.number,
  invoiceLine: PropTypes.object,
  poLine: PropTypes.object,
};

export default InvoiceLineInformation;
