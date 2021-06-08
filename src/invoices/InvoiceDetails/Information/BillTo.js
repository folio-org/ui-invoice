import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';

import { stripesConnect } from '@folio/stripes/core';
import {
  KeyValue,
  NoValue,
} from '@folio/stripes/components';

import { parseAddressConfig } from '../../../common/utils';
import { configAddressItem } from '../../../common/resources';
import invocieCss from '../../Invoice.css';

const BillTo = ({ resources, billToId }) => {
  const billToAddress = get(resources, 'billToAddress.records.0');
  let billToValue = {};

  if (billToAddress) {
    billToValue = parseAddressConfig(billToAddress);
  }

  return (
    <KeyValue label={<FormattedMessage id="ui-invoice.invoice.billTo" />}>
      <div className={invocieCss.addressWrapper}>{billToId ? billToValue.address : <NoValue />}</div>
    </KeyValue>
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
