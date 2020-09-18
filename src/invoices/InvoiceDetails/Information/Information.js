import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

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
  InvoiceDateValue,
  StatusValue,
  PaymentTermsValue,
} from '../../../common/components';
import BatchGroupValue from '../BatchGroupValue';
import BillTo from './BillTo';

const Information = ({
  adjustmentsTotal,
  approvalDate,
  approvedBy,
  batchGroupId,
  invoiceDate,
  paymentDue,
  metadata,
  paymentTerms,
  source,
  status,
  subTotal,
  total,
  billTo,
  invoiceTotalUnits,
  acqUnits,
  currency,
}) => {
  return (
    <>
      {metadata && <ViewMetaData metadata={metadata} />}
      <Row>
        <Col xs={3}>
          <InvoiceDateValue
            labelId="ui-invoice.invoice.details.information.invoiceDate"
            value={invoiceDate}
          />
        </Col>

        <Col xs={3}>
          <StatusValue
            labelId="ui-invoice.invoice.details.information.status"
            value={status}
          />
        </Col>

        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-invoice.invoice.details.information.paymentDue" />}
          >
            <FolioFormattedDate value={paymentDue} />
          </KeyValue>
        </Col>

        <Col xs={3}>
          <PaymentTermsValue
            labelId="ui-invoice.invoice.details.information.terms"
            value={paymentTerms}
          />
        </Col>

        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-invoice.invoice.details.information.approvedDate" />}
          >
            <FolioFormattedDate value={approvalDate} />
          </KeyValue>
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
        <Col xs={6}>
          <BillTo billToId={billTo} />
        </Col>

        <Col xs={3}>
          <BatchGroupValue
            id={batchGroupId}
            label={<FormattedMessage id="ui-invoice.invoice.details.information.batchGroup" />}
          />
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
          <KeyValue label={<FormattedMessage id="ui-invoice.invoice.details.information.totalAmount" />}>
            <AmountWithCurrencyField
              amount={total}
              currency={currency}
            />
          </KeyValue>
        </Col>
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
};

Information.defaultProps = {
  invoiceTotalUnits: 0,
  acqUnits: [],
};

export default Information;
