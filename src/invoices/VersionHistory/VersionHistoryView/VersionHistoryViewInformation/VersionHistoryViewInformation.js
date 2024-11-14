import { isNumber } from 'lodash';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  Row,
} from '@folio/stripes/components';
import { ViewMetaData } from '@folio/stripes/smart-components';
import {
  AcqUnitsView,
  AmountWithCurrencyField,
  FolioFormattedDate,
  VersionKeyValue,
  sourceLabels,
} from '@folio/stripes-acq-components';

import { isCancelled } from '../../../../common/utils';
import { ApprovedBy, CalculatedExchangeAmount, FiscalYearValue, StatusValue } from '../../../../common/components';
import BatchGroupValue from '../../../InvoiceDetails/BatchGroupValue';
import BillTo from '../../../InvoiceDetails/Information/BillTo';

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
    acqUnits,
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
            <VersionKeyValue
              label={<FormattedMessage id="ui-invoice.invoice.cancellationNote" />}
              value={cancellationNote}
            />
          </Col>
        )}

        <Col xs={3}>
          <VersionKeyValue
            label={<FormattedMessage id="ui-invoice.invoice.details.information.paymentDue" />}
            value={<FolioFormattedDate value={paymentDue} />}
          />
        </Col>

        <Col xs={3}>
          <VersionKeyValue
            label={<FormattedMessage id="ui-invoice.invoice.paymentTerms" />}
            value={paymentTerms}
          />
        </Col>

        <Col xs={3}>
          <VersionKeyValue
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
          <VersionKeyValue
            label={<FormattedMessage id="ui-invoice.invoice.details.information.source" />}
            value={sourceLabels[source]}
          />
        </Col>
      </Row>

      <Row>
        <Col xs={3}>
          <VersionKeyValue
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
          <VersionKeyValue label={<FormattedMessage id="ui-invoice.invoice.paymentDate" />}>
            <FolioFormattedDate value={paymentDate} utc={false} />
          </VersionKeyValue>
        </Col>

      </Row>

      <Row>
        <Col xs={3}>
          <VersionKeyValue
            label={<FormattedMessage id="ui-invoice.invoice.details.information.totalUnits" />}
            value={invoiceTotalUnits}
          />
        </Col>

        <Col xs={3}>
          <VersionKeyValue label={<FormattedMessage id="ui-invoice.invoice.details.information.subTotal" />}>
            <AmountWithCurrencyField
              amount={subTotal}
              currency={currency}
            />
          </VersionKeyValue>
        </Col>

        <Col xs={3}>
          <VersionKeyValue label={<FormattedMessage id="ui-invoice.invoice.details.information.adjustment" />}>
            <AmountWithCurrencyField
              amount={adjustmentsTotal}
              currency={currency}
            />
          </VersionKeyValue>
        </Col>

        <Col xs={3}>
          <VersionKeyValue label={<FormattedMessage id="ui-invoice.invoice.details.information.calculatedTotalAmount" />}>
            <AmountWithCurrencyField
              amount={total}
              currency={currency}
            />
          </VersionKeyValue>
        </Col>
      </Row>

      <Row>
        <Col xs={3}>
          <CalculatedExchangeAmount
            currency={currency}
            exchangeRate={exchangeRate}
            total={total}
          />
        </Col>
        {isLockTotal && (
          <Col xs={3} data-testid="lock-total-amount">
            <VersionKeyValue label={<FormattedMessage id="ui-invoice.invoice.lockTotalAmount" />}>
              <AmountWithCurrencyField
                amount={lockTotal}
                currency={currency}
              />
            </VersionKeyValue>
          </Col>
        )}
      </Row>
    </>
  );
};

VersionHistoryViewInformation.propTypes = {
  version: PropTypes.object.isRequired,
};
