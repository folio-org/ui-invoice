import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { find, get } from 'lodash';
import {
  Field,
  getFormValues,
} from 'redux-form';

import {
  Accordion,
  AccordionSet,
  Button,
  Checkbox,
  Col,
  currenciesOptions,
  ExpandAllButton,
  KeyValue,
  Pane,
  PaneMenu,
  Paneset,
  Row,
  TextArea,
  TextField,
} from '@folio/stripes/components';
import { stripesShape } from '@folio/stripes/core';
import stripesForm from '@folio/stripes/form';
import { ViewMetaData } from '@folio/stripes/smart-components';

import {
  FieldDatepicker,
  FieldSelection,
} from '../../common/components';
import { ORGANIZATION_STATUS_ACTIVE } from '../../common/constants';
import {
  getAddressOptions,
  getOrganizationOptions,
  parseAddressConfigs,
  validateRequired,
} from '../../common/utils';

import css from './InvoiceForm.css';

const INVOICE_FORM = 'invoiceForm';
const SECTIONS = {
  invoiceInformation: 'invoiceInformation',
  extendedInformation: 'extendedInformation',
  vendorInformation: 'vendorInformation',
  voucherInformation: 'voucherInformation',
};

export const PAYMENT_METHOD_CASH = 'Cash';
const PAYMENT_METHODS = [
  { label: 'Cash', value: PAYMENT_METHOD_CASH },
  { label: 'Credit Card/P-Card', value: 'Credit Card P Card' },
  { label: 'EFT', value: 'EFT' },
  { label: 'Deposit Account', value: 'Deposit Account' },
  { label: 'Physical Check', value: 'Physical Check' },
  { label: 'Bank Draft', value: 'Bank Draft' },
  { label: 'Internal Transfer', value: 'Internal Transfer' },
  { label: 'Other', value: 'other' },
];

const STATUS_APPROVED = 'Approved';
const STATUS_PAID = 'Paid';
const STATUS_CANCELLED = 'Cancelled';

const STATUSES = [
  { label: 'Open', value: 'Open' },
  { label: 'Reviewed', value: 'Reviewed' },
  { label: 'Approved', value: STATUS_APPROVED },
  { label: 'Paid', value: STATUS_PAID },
  { label: 'Cancelled', value: STATUS_CANCELLED },
];

const POST_APPROVAL_STATUSES = [STATUS_APPROVED, STATUS_PAID, STATUS_CANCELLED];

const IS_EDIT_POST_APPROVAL = (invoice = {}) => {
  return invoice.id && POST_APPROVAL_STATUSES.includes(invoice.status);
};

const getLastMenu = (handleSubmit, pristine, submitting) => {
  return (
    <PaneMenu>
      <Button
        data-test-button-save-invoice
        marginBottom0
        buttonStyle="primary"
        onClick={handleSubmit}
        type="submit"
        disabled={pristine || submitting}
      >
        <FormattedMessage id="ui-invoice.save" />
      </Button>
    </PaneMenu>
  );
};

class InvoiceForm extends Component {
  static propTypes = {
    initialValues: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    parentResources: PropTypes.object.isRequired,
    pristine: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
    stripes: stripesShape,
  }

  constructor(props) {
    super(props);
    this.state = {
      sections: {
        [SECTIONS.voucherInformation]: false,
      },
    };
  }

  onToggleSection = ({ id }) => {
    this.setState(({ sections }) => {
      const isSectionOpened = sections[id];

      return {
        sections: {
          ...sections,
          [id]: !isSectionOpened,
        },
      };
    });
  }

  handleExpandAll = (sections) => {
    this.setState({ sections });
  }

  render() {
    const { initialValues, onCancel, handleSubmit, pristine, submitting, parentResources, stripes } = this.props;
    const { sections } = this.state;
    const vendorInvoiceNo = get(initialValues, 'vendorInvoiceNo', '');
    const lastMenu = getLastMenu(handleSubmit, pristine, submitting);
    const paneTitle = initialValues.id
      ? <FormattedMessage id="ui-invoice.invoice.paneTitle.edit" values={{ vendorInvoiceNo }} />
      : <FormattedMessage id="ui-invoice.invoice.paneTitle.create" />;
    const acquisitionsUnits = [];
    const orgs = get(parentResources, 'vendors.records', []).filter(o => o.isVendor && o.status === ORGANIZATION_STATUS_ACTIVE);
    const addresses = parseAddressConfigs(get(parentResources, 'configAddress.records'));
    const formValues = getFormValues(INVOICE_FORM)(stripes.store.getState());
    const addressBillTo = get(find(addresses, { id: formValues.billTo }), 'address', '');
    const isEditPostApproval = IS_EDIT_POST_APPROVAL(initialValues);
    const metadata = initialValues.metadata;

    return (
      <form>
        <Paneset>
          <Pane
            defaultWidth="fill"
            dismissible
            id="pane-invoice-form"
            lastMenu={lastMenu}
            onClose={onCancel}
            paneTitle={paneTitle}
          >
            <Row>
              <Col xs={12} md={8} mdOffset={2}>
                <Row end="xs">
                  <Col xs={12}>
                    <ExpandAllButton accordionStatus={sections} onToggle={this.handleExpandAll} />
                  </Col>
                </Row>
                <AccordionSet accordionStatus={sections} onToggle={this.onToggleSection}>
                  <Accordion
                    id={SECTIONS.invoiceInformation}
                    label={<FormattedMessage id="ui-invoice.invoiceInformation" />}
                  >
                    {metadata && <ViewMetaData metadata={metadata} />}
                    <Row>
                      <Col data-test-col-invoice-date xs={3}>
                        <FieldDatepicker
                          labelId="ui-invoice.invoice.details.information.invoiceDate"
                          name="invoiceDate"
                          readOnly={isEditPostApproval}
                          required
                          validate={validateRequired}
                        />
                      </Col>
                      <Col data-test-col-payment-due xs={3}>
                        <FieldDatepicker
                          labelId="ui-invoice.invoice.details.information.paymentDue"
                          name="paymentDue"
                        />
                      </Col>
                      <Col data-test-col-payment-terms xs={3}>
                        <Field
                          component={TextField}
                          label={<FormattedMessage id="ui-invoice.invoice.paymentTerms" />}
                          name="paymentTerms"
                          readOnly={isEditPostApproval}
                          type="text"
                        />
                      </Col>
                      <Col data-test-col-source xs={3}>
                        <Field
                          component={TextField}
                          label={<FormattedMessage id="ui-invoice.invoice.details.information.source" />}
                          name="source"
                          readOnly
                          required
                          type="text"
                        />
                      </Col>
                      <Col data-test-col-status xs={3}>
                        <FieldSelection
                          dataOptions={STATUSES}
                          id="invoice-status"
                          labelId="ui-invoice.invoice.details.information.status"
                          name="status"
                          required
                          validate={validateRequired}
                        />
                      </Col>
                      <Col data-test-col-approval-date xs={3}>
                        <FieldDatepicker
                          labelId="ui-invoice.invoice.approvalDate"
                          name="approvalDate"
                          readOnly={isEditPostApproval}
                          required
                          validate={validateRequired}
                        />
                      </Col>
                      <Col data-test-col-approved-by xs={3}>
                        <Field
                          component={TextField}
                          label={<FormattedMessage id="ui-invoice.invoice.approvedBy" />}
                          name="approvedBy"
                          readOnly
                          required
                          type="text"
                        />
                      </Col>
                      <Col data-test-col-acquisitions-unit xs={3}>
                        <FieldSelection
                          dataOptions={acquisitionsUnits}
                          labelId="ui-invoice.invoice.acquisitionsUnit"
                          name="acquisitionsUnit"
                          required
                        />
                      </Col>
                      <Col data-test-col-sub-total xs={3}>
                        <Field
                          component={TextField}
                          label={<FormattedMessage id="ui-invoice.invoice.details.information.subTotal" />}
                          name="subTotal"
                          readOnly
                          required
                          type="text"
                        />
                      </Col>
                      <Col data-test-col-adjustments-total xs={3}>
                        <Field
                          component={TextField}
                          label={<FormattedMessage id="ui-invoice.invoice.details.information.adjustment" />}
                          name="adjustmentsTotal"
                          readOnly
                          required
                          type="text"
                        />
                      </Col>
                      <Col data-test-col-total xs={3}>
                        <Field
                          component={TextField}
                          label={<FormattedMessage id="ui-invoice.invoice.details.information.totalAmount" />}
                          name="total"
                          readOnly
                          required
                          type="text"
                        />
                      </Col>
                      <Col data-test-col-bill-to-name xs={3}>
                        <FieldSelection
                          dataOptions={getAddressOptions(addresses)}
                          labelId="ui-invoice.invoice.billToName"
                          name="billTo"
                        />
                      </Col>
                      <Col
                        className={css.addressWrapper}
                        xs={3}
                      >
                        <KeyValue
                          label={<FormattedMessage id="ui-invoice.invoice.billToAddress" />}
                          value={addressBillTo}
                        />
                      </Col>
                      <Col data-test-col-note xs={3}>
                        <Field
                          component={TextArea}
                          label={<FormattedMessage id="ui-invoice.invoice.note" />}
                          name="note"
                          type="text"
                        />
                      </Col>
                      <Col data-test-col-lock-total xs={3}>
                        <Field
                          component={Checkbox}
                          label={<FormattedMessage id="ui-invoice.invoice.lockTotal" />}
                          name="lockTotal"
                          type="checkbox"
                        />
                      </Col>
                    </Row>
                  </Accordion>
                  <Accordion
                    id={SECTIONS.vendorInformation}
                    label={<FormattedMessage id="ui-invoice.vendorInformation" />}
                  >
                    <Row>
                      <Col data-test-col-vendor-invoice-no xs={3}>
                        <Field
                          component={TextField}
                          label={<FormattedMessage id="ui-invoice.invoice.vendorInvoiceNo" />}
                          name="vendorInvoiceNo"
                          required
                          type="text"
                          validate={validateRequired}
                        />
                      </Col>
                      <Col xs={6}>
                        <FieldSelection
                          dataOptions={getOrganizationOptions(orgs)}
                          id="invoice-vendor"
                          labelId="ui-invoice.invoice.vendorName"
                          name="vendorId"
                          readOnly={isEditPostApproval}
                          required
                          validate={validateRequired}
                        />
                      </Col>
                      <Col data-test-col-accounting-code xs={3}>
                        <FieldSelection
                          dataOptions={[]}
                          labelId="ui-invoice.invoice.accountingCode"
                          name="accountingCode"
                          required
                        // validate={validateRequired}
                        />
                      </Col>
                    </Row>
                  </Accordion>
                  <Accordion
                    id={SECTIONS.extendedInformation}
                    label={<FormattedMessage id="ui-invoice.extendedInformation" />}
                  >
                    <Row>
                      <Col data-test-col-folio-invoice-no xs={3}>
                        <Field
                          component={TextField}
                          label={<FormattedMessage id="ui-invoice.invoice.folioInvoiceNo" />}
                          name="folioInvoiceNo"
                          readOnly
                          required
                          type="text"
                        />
                      </Col>
                      <Col data-test-col-chk-subscription-overlap xs={3}>
                        <Field
                          component={Checkbox}
                          label={<FormattedMessage id="ui-invoice.invoice.chkSubscriptionOverlap" />}
                          name="chkSubscriptionOverlap"
                          readOnly={isEditPostApproval}
                          type="checkbox"
                        />
                      </Col>
                      <Col data-test-col-currency xs={3}>
                        <FieldSelection
                          dataOptions={currenciesOptions}
                          labelId="ui-invoice.invoice.currency"
                          name="currency"
                          readOnly={isEditPostApproval}
                          required
                          validate={validateRequired}
                        />
                      </Col>
                      <Col data-test-col-payment-method xs={3}>
                        <FieldSelection
                          dataOptions={PAYMENT_METHODS}
                          id="invoice-payment-method"
                          labelId="ui-invoice.invoice.paymentMethod"
                          name="paymentMethod"
                          required
                          validate={validateRequired}
                        />
                      </Col>
                      <Col data-test-col-export-to-accounting xs={3}>
                        <Field
                          component={Checkbox}
                          label={<FormattedMessage id="ui-invoice.invoice.exportToAccounting" />}
                          name="exportToAccounting"
                          readOnly={isEditPostApproval}
                          type="checkbox"
                        />
                      </Col>
                    </Row>
                  </Accordion>
                  <Accordion
                    id={SECTIONS.voucherInformation}
                    label={<FormattedMessage id="ui-invoice.voucherInformation" />}
                  >
                    <Row>
                      <Col data-test-col-voucher-number xs={3}>
                        <Field
                          component={TextField}
                          label={<FormattedMessage id="ui-invoice.invoice.voucherNumber" />}
                          name="voucherNumber"
                          readOnly={isEditPostApproval}
                          required
                          type="text"
                        // validate={validateRequired}
                        />
                      </Col>
                    </Row>
                  </Accordion>
                </AccordionSet>
              </Col>
            </Row>
          </Pane>
        </Paneset>
      </form>
    );
  }
}

export default stripesForm({
  form: INVOICE_FORM,
  navigationCheck: true,
})(InvoiceForm);
