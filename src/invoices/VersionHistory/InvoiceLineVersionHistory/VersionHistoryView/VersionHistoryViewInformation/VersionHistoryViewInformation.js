import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  Loading,
  NoValue,
  Row,
} from '@folio/stripes/components';
import {
  ViewMetaData,
} from '@folio/stripes/smart-components';
import {
  AmountWithCurrencyField,
  FolioFormattedDate,
  VendorReferenceNumbersDetails,
  VersionCheckbox,
  VersionKeyValue,
  useOrderLine,
} from '@folio/stripes-acq-components';

export const VersionHistoryViewInformation = ({ version }) => {
  const metadata = version.metadata;

  const {
    orderLine = {},
    isLoading: isOrderLineLoading,
  } = useOrderLine(version?.poLineId);

  const { poLineNumber } = orderLine;

  const {
    currency,
    subTotal,
    description,
    invoiceLineNumber,
    invoiceLineStatus,
    subscriptionInfo,
    subscriptionStart,
    subscriptionEnd,
    comment,
    accountNumber,
    accountingCode,
    quantity,
    releaseEncumbrance,
    referenceNumbers,
  } = version;

  if (isOrderLineLoading) {
    return <Loading />;
  }

  return (
    <>
      {metadata && <ViewMetaData metadata={metadata} />}

      <Row>
        <Col xs={12}>
          <VersionKeyValue
            name="description"
            label={<FormattedMessage id="ui-invoice.invoiceLine.description" />}
            value={description}
          />
        </Col>
        <Col xs={3}>
          <VersionKeyValue
            name="poLineId"
            label={<FormattedMessage id="ui-invoice.invoiceLine.poLineNumber" />}
            value={poLineNumber || <NoValue />}
          />
        </Col>
        <Col xs={3}>
          <VersionKeyValue
            name="invoiceLineNumber"
            label={<FormattedMessage id="ui-invoice.invoiceLine.invoiceLineNumber" />}
            value={invoiceLineNumber}
          />
        </Col>
        <Col xs={3}>
          <VersionKeyValue
            name="invoiceLineStatus"
            label={<FormattedMessage id="ui-invoice.invoice.details.information.status" />}
            value={invoiceLineStatus}
          />
        </Col>
        <Col xs={3}>
          <VersionKeyValue
            name="subscriptionInfo"
            label={<FormattedMessage id="ui-invoice.invoiceLine.subscriptionInfo" />}
            value={subscriptionInfo}
          />
        </Col>
        <Col xs={3}>
          <VersionKeyValue
            name="subscriptionStart"
            label={<FormattedMessage id="ui-invoice.invoiceLine.subscriptionStart" />}
            value={<FolioFormattedDate value={subscriptionStart} />}
          />
        </Col>
        <Col xs={3}>
          <VersionKeyValue
            name="subscriptionEnd"
            label={<FormattedMessage id="ui-invoice.invoiceLine.subscriptionEnd" />}
            value={<FolioFormattedDate value={subscriptionEnd} />}
          />
        </Col>
        <Col xs={3}>
          <VersionKeyValue
            name="comment"
            label={<FormattedMessage id="ui-invoice.invoiceLine.comment" />}
            value={comment}
          />
        </Col>
        <Col xs={3}>
          <VersionKeyValue
            name="accountNumber"
            label={<FormattedMessage id="ui-invoice.invoiceLine.accountNumber" />}
            value={accountNumber}
          />
        </Col>
        <Col xs={3}>
          <VersionKeyValue
            name="accountingCode"
            label={<FormattedMessage id="ui-invoice.invoice.accountingCode" />}
            value={accountingCode}
          />
        </Col>
        <Col xs={3}>
          <VersionKeyValue
            name="quantity"
            label={<FormattedMessage id="ui-invoice.invoiceLine.quantity" />}
            value={quantity}
          />
        </Col>
        <Col xs={3}>
          <VersionKeyValue
            label={<FormattedMessage id="ui-invoice.invoiceLine.subTotal" />}
            name="subTotal"
            value={<AmountWithCurrencyField amount={subTotal} currency={currency} />}
          />
        </Col>
        <Col xs={3}>
          <VersionCheckbox
            checked={Boolean(releaseEncumbrance)}
            disabled
            label={<FormattedMessage id="ui-invoice.invoiceLine.releaseEncumbrance" />}
            type="checkbox"
            name="releaseEncumbrance"
          />
        </Col>
        <Col xs={12}>
          <VersionKeyValue
            name="referenceNumbers"
            label={<FormattedMessage id="ui-invoice.invoiceLine.referenceNumbers" />}
            value={<VendorReferenceNumbersDetails referenceNumbers={referenceNumbers} />}
          />
        </Col>
      </Row>
    </>
  );
};

VersionHistoryViewInformation.propTypes = {
  version: PropTypes.object.isRequired,
};
