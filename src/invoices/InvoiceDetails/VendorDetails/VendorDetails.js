import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  KeyValue,
  Row,
} from '@folio/stripes/components';
import { OrganizationValue } from '@folio/stripes-acq-components';

const VendorDetails = ({ vendorInvoiceNo, accountingCode, vendorId }) => (
  <Row>
    <Col xs={3}>
      <KeyValue
        label={<FormattedMessage id="ui-invoice.invoice.details.vendor.vendorInvoiceNo" />}
        value={vendorInvoiceNo}
      />
    </Col>

    <Col xs={3}>
      <OrganizationValue
        label={<FormattedMessage id="ui-invoice.invoice.details.vendor.name" />}
        id={vendorId}
      />
    </Col>

    <Col xs={3}>
      <KeyValue
        label={<FormattedMessage id="ui-invoice.invoice.accountingCode" />}
        value={accountingCode}
      />
    </Col>
  </Row>
);

VendorDetails.propTypes = {
  vendorInvoiceNo: PropTypes.string.isRequired,
  accountingCode: PropTypes.string,
  vendorId: PropTypes.string.isRequired,
};

export default VendorDetails;
