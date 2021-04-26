import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';
import { useHistory } from 'react-router';

import stripesFinalForm from '@folio/stripes/final-form';
import {
  checkScope,
  Col,
  HasCommand,
  Pane,
  Paneset,
  Row,
} from '@folio/stripes/components';
import {
  FieldDatepickerFinal,
  FormFooter,
  TextField,
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
  const history = useHistory();
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

  const shortcuts = [
    {
      name: 'cancel',
      shortcut: 'esc',
      handler: onCancel,
    },
    {
      name: 'save',
      handler: handleSubmit,
    },
    {
      name: 'search',
      handler: () => history.push('/invoice'),
    },
  ];

  return (
    <HasCommand
      commands={shortcuts}
      isWithinScope={checkScope}
      scope={document.body}
    >
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
              <Field
                component={TextField}
                id="voucherNumber"
                isNonInteractive={!isAllowVoucherNumberEdit}
                label={<FormattedMessage id="ui-invoice.invoice.details.voucher.voucherNumber" />}
                name="voucherNumber"
                type="text"
              />
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
    </HasCommand>
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
