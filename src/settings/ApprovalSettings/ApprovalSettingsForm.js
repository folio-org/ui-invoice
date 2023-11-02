import React from 'react';
import { Field } from 'redux-form';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  Row,
  Checkbox,
} from '@folio/stripes/components';
import { useStripes } from '@folio/stripes/core';

import { hasEditSettingsPerm } from '../utils';

const ApprovalSettingsForm = () => {
  const stripes = useStripes();

  return (
    <Row>
      <Col xs={12}>
        <Field
          component={Checkbox}
          label={<FormattedMessage id="ui-invoice.settings.approvals.isApprovePayEnabled" />}
          name="isApprovePayEnabled"
          type="checkbox"
          disabled={!hasEditSettingsPerm(stripes)}
        />
      </Col>
    </Row>
  );
};

export default ApprovalSettingsForm;
