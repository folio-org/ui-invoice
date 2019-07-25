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

import { parseAddressConfig } from '../../../common/utils';
import { configAddressItem } from '../../../common/resources';

const BillTo = ({ resources }) => {
  const billToAddress = get(resources, 'billToAddress.records.0');
  let billToValue = {};

  if (billToAddress) {
    billToValue = parseAddressConfig(billToAddress);
  }

  return (
    <Row>
      <Col xs={6}>
        <KeyValue
          label={<FormattedMessage id="ui-invoice.invoice.details.information.billToName" />}
          value={billToValue.name}
        />
      </Col>

      <Col xs={6}>
        <KeyValue
          label={<FormattedMessage id="ui-invoice.invoice.details.information.billToAddress" />}
        >
          <div>{billToValue.address}</div>
        </KeyValue>
      </Col>
    </Row>
  );
};

BillTo.manifest = Object.freeze({
  billToAddress: configAddressItem,
});

BillTo.propTypes = {
  resources: PropTypes.object.isRequired,
  // billToId prop is used in manifest
  // eslint-disable-next-line react/no-unused-prop-types
  billToId: PropTypes.string,
};

export default stripesConnect(BillTo);
