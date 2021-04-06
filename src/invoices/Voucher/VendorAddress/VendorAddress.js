import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  KeyValue,
  Loading,
  Row,
} from '@folio/stripes/components';
import { COUNTRY_LABEL_BY_CODE } from '@folio/stripes-acq-components';

import { useVendor } from './useVendor';
import css from './VendorAddress.css';

const VendorAddress = ({ address, vendorId }) => {
  const { vendor, isLoading } = useVendor(vendorId);

  if (isLoading) return <Loading />;

  return (
    <Row className={css.addressContent}>
      <Col xs={3}>
        <KeyValue
          label={<FormattedMessage id="ui-invoice.invoice.details.voucher.vendor" />}
          value={vendor.name}
        />
      </Col>

      <Col xs={3}>
        <KeyValue
          label={<FormattedMessage id="ui-invoice.invoice.details.voucher.addressLine1" />}
          value={address.addressLine1}
        />
      </Col>

      <Col xs={3}>
        <KeyValue
          label={<FormattedMessage id="ui-invoice.invoice.details.voucher.addressLine2" />}
          value={address.addressLine2}
        />
      </Col>

      <Col xs={3}>
        <KeyValue
          label={<FormattedMessage id="ui-invoice.invoice.details.voucher.city" />}
          value={address.city}
        />
      </Col>

      <Col xs={3}>
        <KeyValue
          label={<FormattedMessage id="ui-invoice.invoice.details.voucher.stateRegion" />}
          value={address.stateRegion}
        />
      </Col>

      <Col xs={3}>
        <KeyValue
          label={<FormattedMessage id="ui-invoice.invoice.details.voucher.zipCode" />}
          value={address.zipCode}
        />
      </Col>

      <Col xs={3}>
        <KeyValue
          label={<FormattedMessage id="ui-invoice.invoice.details.voucher.country" />}
          value={COUNTRY_LABEL_BY_CODE[address.country] || address.country}
        />
      </Col>
    </Row>
  );
};

VendorAddress.propTypes = {
  vendorId: PropTypes.string.isRequired,
  address: PropTypes.object,
};

VendorAddress.defaultProps = {
  address: {},
};

export default VendorAddress;
