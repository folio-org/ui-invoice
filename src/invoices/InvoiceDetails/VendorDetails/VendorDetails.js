import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  KeyValue,
  Row,
} from '@folio/stripes/components';
import { OrganizationValue } from '@folio/stripes-acq-components';
import { VendorPrimaryAddress } from '../../../common/components';

const VendorDetails = ({ vendorInvoiceNo, accountingCode, vendor }) => (
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
        id={vendor.id}
      />
    </Col>

    <Col xs={3}>
      <KeyValue
        label={<FormattedMessage id="ui-invoice.invoice.accountingCode" />}
        value={accountingCode}
      />
    </Col>

    <Col xs={12}>
      <VendorPrimaryAddress vendor={vendor} />
    </Col>
  </Row>
);

VendorDetails.propTypes = {
  vendorInvoiceNo: PropTypes.string.isRequired,
  accountingCode: PropTypes.string,
  vendor: PropTypes.object.isRequired,
};

export default VendorDetails;
