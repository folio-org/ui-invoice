import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';

import stripesFinalForm from '@folio/stripes/final-form';
import {
  Row,
  Col,
  TextField,
  Pane,
  Paneset,
  KeyValue,
} from '@folio/stripes/components';
import {
  FieldDatepickerFinal,
  FormFooter,
} from '@folio/stripes-acq-components';
import {
  AppIcon,
} from '@folio/stripes/core';

const VoucherEditForm = ({
  handleSubmit,
  submitting,
  pristine,
  onCancel,
  initialValues,
  vendorInvoiceNo,
  isAllowVoucherNumberEdit,
}) => {
  const paneFooter = (
    <FormFooter
      id="save-voucher-button"
      label={<FormattedMessage id="ui-invoice.saveAndClose" />}
      pristine={pristine}
      submitting={submitting}
      handleSubmit={handleSubmit}
      onCancel={onCancel}
    />
  );

  return (
    <Paneset
      data-test-edit-voucher-form
    >
      <Pane
        appIcon={<AppIcon app="invoice" size="small" />}
        defaultWidth="fill"
        dismissible
        id="pane-edit-voucher"
        footer={paneFooter}
        onClose={onCancel}
        paneSub={
          <FormattedMessage
            id="ui-invoice.voucher.paneSubTitle"
            values={{ voucherNumber: initialValues.voucherNumber }}
          />
        }
        paneTitle={
          <FormattedMessage
            id="ui-invoice.voucher.paneTitle"
            values={{ vendorInvoiceNo }}
          />
        }
      >
        <Row>
          <Col xs={3}>
            {isAllowVoucherNumberEdit
              ? (
                <Field
                  component={TextField}
                  id="voucherNumber"
                  label={<FormattedMessage id="ui-invoice.invoice.details.voucher.voucherNumber" />}
                  name="voucherNumber"
                />
              )
              : (
                <KeyValue
                  label={<FormattedMessage id="ui-invoice.invoice.details.voucher.voucherNumber" />}
                  value={initialValues.voucherNumber}
                />
              )
            }
          </Col>
          <Col xs={3}>
            <Field
              component={TextField}
              id="disbursementNumber"
              label={<FormattedMessage id="ui-invoice.invoice.details.voucher.disbursementNumber" />}
              name="disbursementNumber"
            />
          </Col>
          <Col xs={3}>
            <FieldDatepickerFinal
              label={<FormattedMessage id="ui-invoice.invoice.details.voucher.disbursementDate" />}
              name="disbursementDate"
            />
          </Col>
          <Col xs={3}>
            <Field
              component={TextField}
              id="disbursementAmount"
              label={<FormattedMessage id="ui-invoice.invoice.details.voucher.disbursementAmount" />}
              name="disbursementAmount"
            />
          </Col>
        </Row>
      </Pane>
    </Paneset>
  );
};

VoucherEditForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
  isAllowVoucherNumberEdit: PropTypes.bool.isRequired,
  initialValues: PropTypes.object.isRequired,
  vendorInvoiceNo: PropTypes.string.isRequired,
};

export default stripesFinalForm({
  navigationCheck: true,
})(VoucherEditForm);
