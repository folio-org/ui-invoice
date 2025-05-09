import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';

import {
  KeyValue,
  NoValue,
} from '@folio/stripes/components';
import { stripesConnect } from '@folio/stripes/core';
import {
  baseManifest,
  USERS_API,
  VersionKeyValue,
} from '@folio/stripes-acq-components';

import { getUserName } from '../../utils';

export const ApprovedBy = ({ approvedByUserId, isVersionView, name, resources }) => {
  const { failed, records } = resources.approvedByUser || {};
  const approvedByUser = failed ? null : get(records, '0');
  const value = approvedByUserId ? getUserName(approvedByUser) : <NoValue />;

  const KeyValueComponent = isVersionView ? VersionKeyValue : KeyValue;

  return (
    <KeyValueComponent
      name={name}
      label={<FormattedMessage id="ui-invoice.invoice.approvedBy" />}
      value={value}
    />
  );
};

ApprovedBy.manifest = Object.freeze({
  approvedByUser: {
    ...baseManifest,
    path: `${USERS_API}/!{approvedByUserId}`,
  },
});

ApprovedBy.propTypes = {
  approvedByUserId: PropTypes.string,
  isVersionView: PropTypes.bool,
  name: PropTypes.string,
  resources: PropTypes.shape({
    approvedByUser: PropTypes.object,
  }).isRequired,
};

export default stripesConnect(ApprovedBy);
