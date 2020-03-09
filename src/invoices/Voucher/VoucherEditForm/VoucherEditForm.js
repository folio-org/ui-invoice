import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import stripesFinalForm from '@folio/stripes/form';
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
import { EDIT_VOUCHER_FORM } from './constants';

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
            <TextField
              label={<FormattedMessage id="ui-invoice.invoice.details.voucher.voucherNumber" />}
              name="voucherNumber"
              disabled={!isAllowVoucherNumberEdit}
            />
          </Col>
          <Col xs={3}>
            <TextField
              label={<FormattedMessage id="ui-invoice.invoice.details.voucher.disbursementNumber" />}
              name="disbursementNumber"
            />
          </Col>
          <Col xs={3}>
            <FieldDatepicker
              label={<FormattedMessage id="ui-invoice.invoice.details.voucher.disbursementDate" />}
              name="disbursementDate"
            />
          </Col>
          <Col xs={3}>
            <TextField
              label={<FormattedMessage id="ui-invoice.invoice.details.voucher.disbursementAmount" />}
              name="disbursementAmount"
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

export default stripesFinalForm({
  form: EDIT_VOUCHER_FORM,
  navigationCheck: true,
  enableReinitialize: true,
})(VoucherEditForm);
