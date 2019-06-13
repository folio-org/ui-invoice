import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  KeyValue,
  MetaSection,
  Row,
} from '@folio/stripes/components';

import {
  getInvoiceStatusLabel,
  formatAmount,
  formatDate,
} from '../../../common/utils';

const Information = ({
  adjustmentsTotal,
  createdDate,
  invoiceDate,
  paymentTerms,
  source,
  status,
  subTotal,
  total,
  updatedDate,
}) => {
  return (
    <Fragment>
      <Row>
        <Col xs={12}>
          <MetaSection
            id="invoiceItemMeta"
            createdDate={createdDate}
            lastUpdatedDate={updatedDate}
          />
        </Col>
      </Row>
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
          />
        </Col>

        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-invoice.invoice.details.information.approvedBy" />}
          />
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
  createdDate: PropTypes.string,
  updatedDate: PropTypes.string,
  invoiceDate: PropTypes.string,
  paymentTerms: PropTypes.string,
  status: PropTypes.string.isRequired,
  subTotal: PropTypes.number,
  total: PropTypes.number,
  source: PropTypes.string,
};

Information.defaultProps = {
  adjustmentsTotal: 0,
  createdDate: '',
  updatedDate: '',
  invoiceDate: '',
  paymentTerms: '',
  subTotal: 0,
  total: 0,
  source: '',
};

export default Information;
