import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { isNumber } from 'lodash';

import {
  Col,
  KeyValue,
  Row,
} from '@folio/stripes/components';
import { ViewMetaData } from '@folio/stripes/smart-components';
import {
  AcqUnitsView,
  AmountWithCurrencyField,
  FolioFormattedDate,
  sourceLabels,
} from '@folio/stripes-acq-components';

import {
  ApprovedBy,
  CalculatedExchangeAmount,
  FiscalYearValueContainer as FiscalYearValue,
  StatusValue,
} from '../../../common/components';
import { isCancelled } from '../../../common/utils';
import BatchGroupValue from '../BatchGroupValue';
import BillTo from './BillTo';

const Information = ({
  acqUnits = [],
  adjustmentsTotal,
  approvalDate,
  approvedBy,
  batchGroupId,
  billTo,
  cancellationNote,
  currency,
  exchangeRate,
  fiscalYearId,
  invoiceDate,
  invoiceTotalUnits = 0,
  isForeignCurrency,
  lockTotal,
  metadata,
  note,
  paymentDate,
  paymentDue,
  paymentTerms,
  source,
  status,
  subTotal,
  total,
}) => {
  const isLockTotal = isNumber(lockTotal);

  return (
    <>
      {metadata && <ViewMetaData metadata={metadata} />}
      <Row>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-invoice.invoice.details.information.invoiceDate" />}
            value={<FolioFormattedDate value={invoiceDate} />}
          />
        </Col>

        <Col xs={3}>
          <FiscalYearValue fiscalYearId={fiscalYearId} />
        </Col>

        <Col xs={3}>
          <StatusValue value={status} />
        </Col>

        {isCancelled(status) && (
          <Col xs={3}>
            <KeyValue
              label={<FormattedMessage id="ui-invoice.invoice.cancellationNote" />}
              value={cancellationNote}
            />
          </Col>
        )}

        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-invoice.invoice.details.information.paymentDue" />}
            value={<FolioFormattedDate value={paymentDue} />}
          />
        </Col>

        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-invoice.invoice.paymentTerms" />}
            value={paymentTerms}
          />
        </Col>

        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-invoice.invoice.details.information.approvedDate" />}
            value={<FolioFormattedDate value={approvalDate} utc={false} />}
          />
        </Col>

        <Col
          data-test-approved-by
          xs={3}
        >
          <ApprovedBy approvedByUserId={approvedBy} />
        </Col>

        <Col xs={3}>
          <AcqUnitsView units={acqUnits} />
        </Col>

        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-invoice.invoice.details.information.source" />}
            value={sourceLabels[source]}
          />
        </Col>
      </Row>

      <Row>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-invoice.invoice.note" />}
            value={note}
          />
        </Col>

        <Col xs={3}>
          <BillTo billToId={billTo} />
        </Col>

        <Col xs={3}>
          <BatchGroupValue
            id={batchGroupId}
            label={<FormattedMessage id="ui-invoice.invoice.details.information.batchGroup" />}
          />
        </Col>

        <Col xs={3}>
          <KeyValue label={<FormattedMessage id="ui-invoice.invoice.paymentDate" />}>
            <FolioFormattedDate value={paymentDate} utc={false} />
          </KeyValue>
        </Col>

      </Row>

      <Row>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-invoice.invoice.details.information.totalUnits" />}
            value={invoiceTotalUnits}
          />
        </Col>

        <Col xs={3}>
          <KeyValue label={<FormattedMessage id="ui-invoice.invoice.details.information.subTotal" />}>
            <AmountWithCurrencyField
              amount={subTotal}
              currency={currency}
            />
          </KeyValue>
        </Col>

        <Col xs={3}>
          <KeyValue label={<FormattedMessage id="ui-invoice.invoice.details.information.adjustment" />}>
            <AmountWithCurrencyField
              amount={adjustmentsTotal}
              currency={currency}
            />
          </KeyValue>
        </Col>

        <Col xs={3}>
          <KeyValue label={<FormattedMessage id="ui-invoice.invoice.details.information.calculatedTotalAmount" />}>
            <AmountWithCurrencyField
              amount={total}
              currency={currency}
            />
          </KeyValue>
        </Col>
      </Row>

      <Row>
        {isForeignCurrency && (
          <Col xs={3}>
            <CalculatedExchangeAmount
              currency={currency}
              exchangeRate={exchangeRate}
              total={total}
            />
          </Col>
        )}

        {isLockTotal && (
          <Col xs={3} data-testid="lock-total-amount">
            <KeyValue label={<FormattedMessage id="ui-invoice.invoice.lockTotalAmount" />}>
              <AmountWithCurrencyField
                amount={lockTotal}
                currency={currency}
              />
            </KeyValue>
          </Col>
        )}
      </Row>
    </>
  );
};

Information.propTypes = {
  acqUnits: PropTypes.arrayOf(PropTypes.string),
  adjustmentsTotal: PropTypes.number,
  approvalDate: PropTypes.string,
  approvedBy: PropTypes.string,
  batchGroupId: PropTypes.string.isRequired,
  billTo: PropTypes.string,
  cancellationNote: PropTypes.string,
  currency: PropTypes.string.isRequired,
  exchangeRate: PropTypes.number,
  fiscalYearId: PropTypes.string,
  invoiceDate: PropTypes.string.isRequired,
  invoiceTotalUnits: PropTypes.number,
  isForeignCurrency: PropTypes.bool,
  lockTotal: PropTypes.number,
  metadata: PropTypes.object,
  note: PropTypes.string,
  paymentDate: PropTypes.string,
  paymentDue: PropTypes.string,
  paymentTerms: PropTypes.string,
  source: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  subTotal: PropTypes.number,
  total: PropTypes.number,
};

export default Information;
