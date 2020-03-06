import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'redux-form';

import stripesForm from '@folio/stripes/form';
import {
  Row,
  Col,
  TextField,
  Pane,
} from '@folio/stripes/components';
import {
  FieldDatepicker,
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
      id="clickable-save"
      label={<FormattedMessage id="ui-invoice.saveAndClose" />}
      pristine={pristine}
      submitting={submitting}
      handleSubmit={handleSubmit}
      onCancel={onCancel}
    />
  );

  return (
    <form
      data-test-edit-voucher-form
      style={{ height: '100vh' }}
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
            <Field
              label={<FormattedMessage id="ui-invoice.invoice.details.voucher.voucherNumber" />}
              name="voucherNumber"
              disabled={!isAllowVoucherNumberEdit}
              component={TextField}
            />
          </Col>
          <Col xs={3}>
            <Field
              label={<FormattedMessage id="ui-invoice.invoice.details.voucher.disbursementNumber" />}
              name="disbursementNumber"
              component={TextField}
            />
          </Col>
          <Col xs={3}>
            <Field
              label={<FormattedMessage id="ui-invoice.invoice.details.voucher.disbursementDate" />}
              name="disbursementDate"
              component={FieldDatepicker}
            />
          </Col>
          <Col xs={3}>
            <Field
              label={<FormattedMessage id="ui-invoice.invoice.details.voucher.disbursementAmount" />}
              name="disbursementAmount"
              component={TextField}
            />
          </Col>
        </Row>
      </Pane>
    </form>
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

export default stripesForm({
  form: 'voucherInfo',
  navigationCheck: true,
  enableReinitialize: true,
})(VoucherEditForm);
