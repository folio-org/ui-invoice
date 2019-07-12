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
} from '../../../common/utils';
import ApprovedBy from '../../../common/components/ApprovedBy';

const Information = ({
  adjustmentsTotal,
  approvalDate,
  approvedBy,
  invoiceDate,
  metadata,
  paymentTerms,
  source,
  status,
  subTotal,
  total,
}) => {
  return (
    <Fragment>
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
          />
        </Col>

        <Col xs={3}>
          <KeyValue label={<FormattedMessage id="ui-invoice.invoice.details.information.terms" />}>
            {paymentTerms}
          </KeyValue>
        </Col>

        <Col xs={3}>
          <KeyValue label={<FormattedMessage id="ui-invoice.invoice.details.information.source" />}>
            {source}
          </KeyValue>
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

        <Col xs={3}>
          <ApprovedBy approvedByUserId={approvedBy} />
        </Col>

        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-invoice.invoice.details.information.owner" />}
          />
        </Col>

        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-invoice.invoice.details.information.totalUnits" />}
          />
        </Col>

        <Col xs={3}>
          <KeyValue label={<FormattedMessage id="ui-invoice.invoice.details.information.totalAmount" />}>
            {formatAmount(total)}
          </KeyValue>
        </Col>

        <Col xs={3}>
          <KeyValue label={<FormattedMessage id="ui-invoice.invoice.details.information.adjustment" />}>
            {formatAmount(adjustmentsTotal)}
          </KeyValue>
        </Col>

        <Col xs={3}>
          <KeyValue label={<FormattedMessage id="ui-invoice.invoice.details.information.subTotal" />}>
            {formatAmount(subTotal)}
          </KeyValue>
        </Col>
      </Row>
    </Fragment>
  );
};

Information.propTypes = {
  adjustmentsTotal: PropTypes.number,
  approvalDate: PropTypes.string,
  approvedBy: PropTypes.string,
  invoiceDate: PropTypes.string,
  paymentTerms: PropTypes.string,
  status: PropTypes.string.isRequired,
  subTotal: PropTypes.number,
  total: PropTypes.number,
  source: PropTypes.string,
  metadata: PropTypes.object,
};

Information.defaultProps = {
  adjustmentsTotal: 0,
  approvalDate: '',
  approvedBy: '',
  invoiceDate: '',
  paymentTerms: '',
  subTotal: 0,
  total: 0,
  source: '',
};

export default Information;
