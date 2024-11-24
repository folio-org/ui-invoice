import isNumber from 'lodash/isNumber';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  Row,
} from '@folio/stripes/components';
import { ViewMetaData } from '@folio/stripes/smart-components';
import {
  AmountWithCurrencyField,
  FolioFormattedDate,
  VersionKeyValue,
  sourceLabels,
} from '@folio/stripes-acq-components';

import {
  ApprovedBy,
  CalculatedExchangeAmount,
  FiscalYearValueContainer,
  StatusValue,
} from '../../../../../common/components';
import { isCancelled } from '../../../../../common/utils';
import BatchGroupValue from '../../../../InvoiceDetails/BatchGroupValue';

export const VersionHistoryViewInformation = ({ version = {} }) => {
  const {
    adjustmentsTotal,
    approvalDate,
    approvedBy,
    batchGroupId,
    exchangeRate,
    invoiceDate,
    fiscalYearId,
    paymentDue,
    paymentTerms,
    status,
    subTotal,
    total,
    source,
    metadata,
    billTo,
    invoiceTotalUnits,
    acqUnits = [],
    currency,
    note,
    lockTotal,
    paymentDate,
    cancellationNote,
  } = version;
  const isLockTotal = isNumber(lockTotal);

  return (
    <>
      {version && <ViewMetaData metadata={metadata} />}
      <Row>
        <Col xs={3}>
          <VersionKeyValue
            name="invoiceDate"
            label={<FormattedMessage id="ui-invoice.invoice.details.information.invoiceDate" />}
            value={<FolioFormattedDate value={invoiceDate} />}
          />
        </Col>

        <Col xs={3}>
          <FiscalYearValueContainer
            fiscalYearId={fiscalYearId}
            isVersionView
            name="fiscalYearId"
          />
        </Col>

        <Col xs={3}>
          <StatusValue
            isVersionView
            name="status"
            value={status}
          />
        </Col>

        {isCancelled(status) && (
          <Col xs={3}>
            <VersionKeyValue
              name="cancellationNote"
              label={<FormattedMessage id="ui-invoice.invoice.cancellationNote" />}
              value={cancellationNote}
            />
          </Col>
        )}

        <Col xs={3}>
          <VersionKeyValue
            name="paymentDue"
            label={<FormattedMessage id="ui-invoice.invoice.details.information.paymentDue" />}
            value={<FolioFormattedDate value={paymentDue} />}
          />
        </Col>

        <Col xs={3}>
          <VersionKeyValue
            name="paymentTerms"
            label={<FormattedMessage id="ui-invoice.invoice.paymentTerms" />}
            value={paymentTerms}
          />
        </Col>

        <Col xs={3}>
          <VersionKeyValue
            name="approvedDate"
            label={<FormattedMessage id="ui-invoice.invoice.details.information.approvedDate" />}
            value={<FolioFormattedDate value={approvalDate} utc={false} />}
          />
        </Col>

        <Col
          data-test-approved-by
          xs={3}
        >
          <ApprovedBy
            approvedByUserId={approvedBy}
            isVersionView
            name="approvedBy"
          />
        </Col>

        <Col xs={3}>
          <VersionKeyValue
            name="acqUnitIds"
            label={<FormattedMessage id="stripes-acq-components.label.acqUnits" />}
            value={acqUnits}
            multiple
          />
        </Col>

        <Col xs={3}>
          <VersionKeyValue
            label={<FormattedMessage id="ui-invoice.invoice.details.information.source" />}
            name="source"
            value={sourceLabels[source]}
          />
        </Col>
      </Row>

      <Row>
        <Col xs={3}>
          <VersionKeyValue
            label={<FormattedMessage id="ui-invoice.invoice.note" />}
            name="note"
            value={note}
          />
        </Col>

        <Col xs={3}>
          <VersionKeyValue
            name="billTo"
            label={<FormattedMessage id="ui-orders.orderDetails.billTo" />}
            value={billTo}
          />
        </Col>

        <Col xs={3}>
          <BatchGroupValue
            name="batchGroupId"
            id={batchGroupId}
            isVersionView
            label={<FormattedMessage id="ui-invoice.invoice.details.information.batchGroup" />}
          />
        </Col>

        <Col xs={3}>
          <VersionKeyValue
            name="paymentDate"
            label={<FormattedMessage id="ui-invoice.invoice.paymentDate" />}
            value={<FolioFormattedDate value={paymentDate} utc={false} />}
          />
        </Col>

      </Row>

      <Row>
        <Col xs={3}>
          <VersionKeyValue
            name="invoiceTotalUnits"
            label={<FormattedMessage id="ui-invoice.invoice.details.information.totalUnits" />}
            value={invoiceTotalUnits}
          />
        </Col>

        <Col xs={3}>
          <VersionKeyValue
            name="subTotal"
            label={<FormattedMessage id="ui-invoice.invoice.details.information.subTotal" />}
            value={<AmountWithCurrencyField amount={subTotal} currency={currency} />}
          />
        </Col>

        <Col xs={3}>
          <VersionKeyValue
            name="adjustmentsTotal"
            label={<FormattedMessage id="ui-invoice.invoice.details.information.adjustment" />}
            value={<AmountWithCurrencyField amount={adjustmentsTotal} currency={currency} />}
          />
        </Col>

        <Col xs={3}>
          <VersionKeyValue
            name="total"
            label={<FormattedMessage id="ui-invoice.invoice.details.information.calculatedTotalAmount" />}
            value={<AmountWithCurrencyField amount={total} currency={currency} />}
          />
        </Col>
      </Row>

      <Row>
        {
          exchangeRate && (
            <Col xs={3}>
              <CalculatedExchangeAmount
                currency={currency}
                exchangeRate={exchangeRate}
                total={total}
                name="exchangeRate"
                isVersionView
              />
            </Col>
          )
        }
        {isLockTotal && (
          <Col xs={3} data-testid="lock-total-amount">
            <VersionKeyValue
              name="lockTotal"
              label={<FormattedMessage id="ui-invoice.invoice.lockTotalAmount" />}
              value={<AmountWithCurrencyField amount={lockTotal} currency={currency} />}
            />
          </Col>
        )}
      </Row>
    </>
  );
};

VersionHistoryViewInformation.propTypes = {
  version: PropTypes.object.isRequired,
};
