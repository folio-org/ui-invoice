import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';

import { KeyValue } from '@folio/stripes/components';
import { stripesConnect } from '@folio/stripes/core';

import { BASE_RESOURCE } from '../../resources/base';

const getUserName = (user) => {
  const lastName = get(user, ['personal', 'lastName'], '');
  const firstName = get(user, ['personal', 'firstName'], '');
  const middleName = get(user, ['personal', 'middleName'], '');

  return `${lastName}${firstName ? ', ' : ' '}${firstName} ${middleName}`;
};

const ApprovedBy = ({ approvedByUserId, resources }) => {
  const { failed, records } = resources.approvedByUser || {};
  const approvedByUser = failed ? null : get(records, '0');
  const value = approvedByUserId ? getUserName(approvedByUser) : null;

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
    path: 'users/!{approvedByUserId}',
  },
});

ApprovedBy.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  approvedByUserId: PropTypes.string,
  resources: PropTypes.shape({
    approvedByUser: PropTypes.object,
  }).isRequired,
};

ApprovedBy.defaultProps = {
  approvedByUserId: null,
};

export default stripesConnect(ApprovedBy);
