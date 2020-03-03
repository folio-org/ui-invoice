import React from 'react';
import { Field } from 'redux-form';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  Row,
  Checkbox,
  TextField,
} from '@folio/stripes/components';
import SettingsVoucherNumberReset from './SettingsVoucherNumberReset';

import css from './VoucherNumber.css';

const SettingsVoucherNumberForm = () => (
  <>
    <Row>
      <Col xs={12}>
        <Field
          component={TextField}
          label={<FormattedMessage id="ui-invoice.settings.voucherNumber.prefix" />}
          name="voucherNumberPrefix"
        />
      </Col>
    </Row>

    <SettingsVoucherNumberReset />

    <Row>
      <Col xs={12} className={css.allowNumberEdit}>
        <Field
          component={Checkbox}
          label={<FormattedMessage id="ui-invoice.settings.voucherNumber.allowVoucherNumberEdit" />}
          name="allowVoucherNumberEdit"
          type="checkbox"
        />
      </Col>
    </Row>
  </>
);

SettingsVoucherNumberForm.propTypes = {};

export default SettingsVoucherNumberForm;
