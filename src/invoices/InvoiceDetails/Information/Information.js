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
  FiscalYearValueContainer as FiscalYearValue,
  StatusValue,
} from '../../../common/components';
import { isCancelled } from '../../../common/utils';
import BatchGroupValue from '../BatchGroupValue';
import BillTo from './BillTo';

const Information = ({
  adjustmentsTotal,
  approvalDate,
  approvedBy,
  batchGroupId,
  fiscalYearId,
  invoiceDate,
  paymentDue,
  metadata,
  paymentDate,
  paymentTerms,
  source,
  status,
  subTotal,
  total,
  billTo,
  invoiceTotalUnits,
  acqUnits,
  currency,
  note,
  lockTotal,
  cancellationNote,
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
  adjustmentsTotal: PropTypes.number,
  approvalDate: PropTypes.string,
  approvedBy: PropTypes.string,
  batchGroupId: PropTypes.string.isRequired,
  invoiceDate: PropTypes.string.isRequired,
  fiscalYearId: PropTypes.string,
  paymentDue: PropTypes.string,
  paymentTerms: PropTypes.string,
  status: PropTypes.string.isRequired,
  subTotal: PropTypes.number,
  total: PropTypes.number,
  source: PropTypes.string.isRequired,
  metadata: PropTypes.object,
  billTo: PropTypes.string,
  invoiceTotalUnits: PropTypes.number,
  acqUnits: PropTypes.arrayOf(PropTypes.string),
  currency: PropTypes.string.isRequired,
  note: PropTypes.string,
  lockTotal: PropTypes.number,
  paymentDate: PropTypes.string,
  cancellationNote: PropTypes.string,
};

Information.defaultProps = {
  invoiceTotalUnits: 0,
  acqUnits: [],
};

export default Information;
