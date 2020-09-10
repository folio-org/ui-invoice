import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';

import {
  KeyValue,
  NoValue,
} from '@folio/stripes/components';
import { stripesConnect } from '@folio/stripes/core';

import { BASE_RESOURCE } from '../../resources/base';
import { USERS_API } from '../../constants/api';
import { getUserName } from '../../utils';

const ApprovedBy = ({ approvedByUserId, resources }) => {
  const { failed, records } = resources.approvedByUser || {};
  const approvedByUser = failed ? null : get(records, '0');
  const value = approvedByUserId ? getUserName(approvedByUser) : <NoValue />;

  return (
    <KeyValue
      label={<FormattedMessage id="ui-invoice.invoice.approvedBy" />}
      value={value}
    />
  );
};

ApprovedBy.manifest = Object.freeze({
  approvedByUser: {
    ...BASE_RESOURCE,
    path: `${USERS_API}/!{approvedByUserId}`,
  },
});

ApprovedBy.propTypes = {
  approvedByUserId: PropTypes.string,
  resources: PropTypes.shape({
    approvedByUser: PropTypes.object,
  }).isRequired,
};

export default stripesConnect(ApprovedBy);
