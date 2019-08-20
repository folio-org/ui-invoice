import React, { Fragment } from 'react';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';
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

const SettingsVoucherNumberForm = ({ onReset, firstSequenceNumber }) => (
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
          type="number"
        />
      </Col>
    </Row>
    <Row>
      <Col
        xs={12}
        data-test-invoice-settings-voucher-number-start
      >
        <KeyValue
          label={<FormattedMessage id="ui-invoice.settings.voucherNumber.firstInSequence" />}
          value={firstSequenceNumber}
        />
      </Col>
    </Row>
    <Row>
      <Col xs={12}>
        <KeyValue
          label={<FormattedMessage id="ui-invoice.settings.voucherNumber.nextInSequence" />}
          value={+firstSequenceNumber + 1}
        />
      </Col>
    </Row>
    <Row>
      <Col xs={12}>
        <Button
          onClick={onReset}
          data-test-invoice-settings-voucher-number-reset
        >
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

SettingsVoucherNumberForm.propTypes = {
  onReset: PropTypes.func.isRequired,
  firstSequenceNumber: PropTypes.string.isRequired,
};

export default SettingsVoucherNumberForm;
