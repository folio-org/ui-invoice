import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';

import { stripesConnect } from '@folio/stripes/core';
import {
  Col,
  KeyValue,
  Row,
} from '@folio/stripes/components';

import { vendorItem } from '../../../common/resources';

const VendorDetails = ({ vendorInvoiceNo, accountingCode, resources }) => {
  const vendorName = get(resources, 'vendor.records.0.name');

  return (
    <Row>
      <Col xs={3}>
        <KeyValue
          label={<FormattedMessage id="ui-invoice.invoice.details.vendor.vendorInvoiceNo" />}
          value={vendorInvoiceNo}
        />
      </Col>

      <Col xs={3}>
        <KeyValue
          label={<FormattedMessage id="ui-invoice.invoice.details.vendor.name" />}
          value={vendorName}
        />
      </Col>

      <Col xs={3}>
        <KeyValue
          label={<FormattedMessage id="ui-invoice.invoice.details.vendor.accountingCode" />}
          value={accountingCode}
        />
      </Col>
    </Row>
  );
};

VendorDetails.manifest = {
  vendor: vendorItem,
};

VendorDetails.propTypes = {
  vendorInvoiceNo: PropTypes.string,
  accountingCode: PropTypes.string,
  // vendorId prop is used in manifest
  // eslint-disable-next-line react/no-unused-prop-types
  vendorId: PropTypes.string,
  resources: PropTypes.object.isRequired,
};

export default stripesConnect(VendorDetails);
