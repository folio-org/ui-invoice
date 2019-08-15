import React, { Fragment } from 'react';
import { Field } from 'redux-form';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  Row,
  Checkbox,
  TextField,
  Button,
  KeyValue,
} from '@folio/stripes/components';

import css from './VoucherNumber.css';

const SettingsVoucherNumberForm = () => (
  <Fragment>
    <Row>
      <Col xs={12}>
        <Field
          component={TextField}
          label={<FormattedMessage id="ui-invoice.settings.voucherNumber.prefix" />}
          name="voucherNumberPrefix"
        />
      </Col>
    </Row>
    <Row>
      <Col xs={12}>
        <Field
          component={TextField}
          label={<FormattedMessage id="ui-invoice.settings.voucherNumber.startNumber" />}
          name="sequenceNumber"
          disabled
          required
        />
      </Col>
    </Row>
    <Row>
      <Col xs={12}>
        <KeyValue
          label={<FormattedMessage id="ui-invoice.settings.voucherNumber.firstInSequence" />}
          value={1}
        />
      </Col>
    </Row>
    <Row>
      <Col xs={12}>
        <KeyValue
          label={<FormattedMessage id="ui-invoice.settings.voucherNumber.nextInSequence" />}
          value={1}
        />
      </Col>
    </Row>
    <Row>
      <Col xs={12}>
        <Button marginBottom0>
          <FormattedMessage id="ui-invoice.settings.voucherNumber.reset" />
        </Button>
      </Col>
    </Row>
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
  </Fragment>

);

export default SettingsVoucherNumberForm;
