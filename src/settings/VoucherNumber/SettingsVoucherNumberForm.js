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

const validatePrefix = prefix => (
  prefix?.match(/[^a-zA-Z]/)
    ? <FormattedMessage id="ui-invoice.settings.voucherNumber.prefixValidation" />
    : undefined
);

const SettingsVoucherNumberForm = () => (
  <>
    <Row>
      <Col xs={12}>
        <Field
          component={TextField}
          id="voucherNumberPrefix"
          label={<FormattedMessage id="ui-invoice.settings.voucherNumber.prefix" />}
          name="voucherNumberPrefix"
          validate={validatePrefix}
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
