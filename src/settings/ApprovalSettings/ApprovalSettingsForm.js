import React from 'react';
import { Field } from 'redux-form';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  Row,
  Checkbox,
} from '@folio/stripes/components';

const ApprovalSettingsForm = () => (
  <Row>
    <Col xs={12}>
      <Field
        component={Checkbox}
        label={<FormattedMessage id="ui-invoice.settings.approvals.isApprovePayEnabled" />}
        name="isApprovePayEnabled"
        type="checkbox"
      />
    </Col>
  </Row>
);

export default ApprovalSettingsForm;
