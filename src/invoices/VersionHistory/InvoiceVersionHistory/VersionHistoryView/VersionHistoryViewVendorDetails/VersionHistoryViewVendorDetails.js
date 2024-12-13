import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  Row,
} from '@folio/stripes/components';
import {
  VersionKeyValue,
} from '@folio/stripes-acq-components';

export const VersionHistoryViewVendorDetails = ({ version }) => {
  const {
    vendor,
    vendorInvoiceNo,
    accountingCode,
  } = version;

  return (
    <Row>
      <Col xs={3}>
        <VersionKeyValue
          name="vendorInvoiceNo"
          label={<FormattedMessage id="ui-invoice.invoice.details.vendor.vendorInvoiceNo" />}
          value={vendorInvoiceNo}
        />
      </Col>
      <Col xs={3}>
        <VersionKeyValue
          name="vendorId"
          label={<FormattedMessage id="ui-invoice.invoice.details.vendor.name" />}
          value={vendor}
        />
      </Col>
      <Col xs={3}>
        <VersionKeyValue
          name="accountingCode"
          label={<FormattedMessage id="ui-invoice.invoice.accountingCode" />}
          value={accountingCode}
        />
      </Col>
    </Row>
  );
};

VersionHistoryViewVendorDetails.propTypes = {
  version: PropTypes.object.isRequired,
};
