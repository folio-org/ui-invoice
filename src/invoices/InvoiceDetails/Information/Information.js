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
  sourceLabels,
} from '@folio/stripes-acq-components';

import {
  getInvoiceStatusLabel,
  formatDate,
} from '../../../common/utils';
import BatchGroupValue from '../BatchGroupValue';
import ApprovedBy from '../../../common/components/ApprovedBy';
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
          <KeyValue label={<FormattedMessage id="ui-invoice.invoice.details.information.invoiceDate" />}>
            {formatDate(invoiceDate)}
          </KeyValue>
        </Col>

        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-invoice.invoice.details.information.paymentDue" />}
          >
            {formatDate(paymentDue)}
          </KeyValue>
        </Col>

        <Col xs={3}>
          <KeyValue label={<FormattedMessage id="ui-invoice.invoice.details.information.terms" />}>
            {paymentTerms}
          </KeyValue>
        </Col>

        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-invoice.invoice.details.information.source" />}
            value={sourceLabels[source]}
          />

        </Col>

        <Col xs={3}>
          <KeyValue label={<FormattedMessage id="ui-invoice.invoice.details.information.status" />}>
            <FormattedMessage id={getInvoiceStatusLabel({ status })} />
          </KeyValue>
        </Col>

        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-invoice.invoice.details.information.approvedDate" />}
          >
            {formatDate(approvalDate)}
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
            label={<FormattedMessage id="ui-invoice.invoice.details.information.totalUnits" />}
            value={invoiceTotalUnits}
          />
        </Col>

        <Col xs={3}>
          <KeyValue label={<FormattedMessage id="ui-invoice.invoice.details.information.totalAmount" />}>
            <AmountWithCurrencyField
              amount={total}
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
          <KeyValue label={<FormattedMessage id="ui-invoice.invoice.details.information.subTotal" />}>
            <AmountWithCurrencyField
              amount={subTotal}
              currency={currency}
            />
          </KeyValue>
        </Col>

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
    </>
  );
};

Information.propTypes = {
  adjustmentsTotal: PropTypes.number,
  approvalDate: PropTypes.string,
  approvedBy: PropTypes.string,
  batchGroupId: PropTypes.string,
  invoiceDate: PropTypes.string,
  paymentDue: PropTypes.string,
  paymentTerms: PropTypes.string,
  status: PropTypes.string.isRequired,
  subTotal: PropTypes.number,
  total: PropTypes.number,
  source: PropTypes.string,
  metadata: PropTypes.object,
  billTo: PropTypes.string,
  invoiceTotalUnits: PropTypes.number,
  acqUnits: PropTypes.arrayOf(PropTypes.string),
  currency: PropTypes.string,
};

Information.defaultProps = {
  adjustmentsTotal: 0,
  approvalDate: '',
  approvedBy: '',
  invoiceDate: '',
  paymentDue: '',
  paymentTerms: '',
  subTotal: 0,
  total: 0,
  source: '',
  invoiceTotalUnits: 0,
  acqUnits: [],
  currency: '',
};

export default Information;
