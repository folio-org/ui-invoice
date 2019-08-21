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

const SettingsVoucherNumberForm = ({ onReset, sequenceNumber, onChangeStartNumber }) => (
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
        <TextField
          label={<FormattedMessage id="ui-invoice.settings.voucherNumber.startNumber" />}
          name="sequenceNumber"
          type="number"
          value={1}
          onChange={onChangeStartNumber}
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
          value={sequenceNumber}
        />
      </Col>
    </Row>
    <Row>
      <Col xs={12}>
        <KeyValue
          label={<FormattedMessage id="ui-invoice.settings.voucherNumber.nextInSequence" />}
          value={+sequenceNumber + 1}
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
  onChangeStartNumber: PropTypes.func.isRequired,
  sequenceNumber: PropTypes.string.isRequired,
};

export default SettingsVoucherNumberForm;
