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
} from '@folio/stripes-acq-components';

import {
  INVOICE_STATUSES_OPTIONS,
  ORGANIZATION_STATUS_ACTIVE,
  PAYMENT_METHODS_OPTIONS,
} from '../../common/constants';
import {
  expandAll,
  getAddressOptions,
  getOrganizationOptions,
  IS_EDIT_POST_APPROVAL,
  parseAddressConfigs,
  toggleSection,
  validateRequired,
} from '../../common/utils';
import ApprovedBy from '../../common/components/ApprovedBy';
import AdjustmentsForm from '../AdjustmentsForm';

import css from './InvoiceForm.css';

const INVOICE_FORM = 'invoiceForm';
const SECTIONS = {
  invoiceInformation: 'invoiceInformation',
  extendedInformation: 'extendedInformation',
  adjustments: 'adjustments',
  vendorInformation: 'vendorInformation',
  voucherInformation: 'voucherInformation',
  links: 'links',
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
  };

  constructor(props) {
    super(props);
    this.state = {
      sections: {
        [SECTIONS.voucherInformation]: false,
      },
    };
    this.expandAll = expandAll.bind(this);
    this.toggleSection = toggleSection.bind(this);
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
    const isEditPostApproval = IS_EDIT_POST_APPROVAL(initialValues.id, initialValues.status);
    const metadata = initialValues.metadata;
    const approvedBy = get(initialValues, 'approvedBy');

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
                    <ExpandAllButton accordionStatus={sections} onToggle={this.expandAll} />
                  </Col>
                </Row>
                <AccordionSet accordionStatus={sections} onToggle={this.toggleSection}>
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
                          disabled={isEditPostApproval}
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
                          disabled={isEditPostApproval}
                          type="text"
                        />
                      </Col>
                      <Col data-test-col-source xs={3}>
                        <Field
                          component={TextField}
                          label={<FormattedMessage id="ui-invoice.invoice.details.information.source" />}
                          name="source"
                          disabled
                          required
                          type="text"
                        />
                      </Col>
                      <Col data-test-col-status xs={3}>
                        <FieldSelection
                          dataOptions={INVOICE_STATUSES_OPTIONS}
                          id="invoice-status"
                          label={<FormattedMessage id="ui-invoice.invoice.details.information.status" />}
                          name="status"
                          required
                          validate={validateRequired}
                        />
                      </Col>
                      <Col data-test-col-approval-date xs={3}>
                        <FieldDatepicker
                          labelId="ui-invoice.invoice.approvalDate"
                          name="approvalDate"
                          disabled
                        />
                      </Col>
                      <Col data-test-col-approved-by xs={3}>
                        <ApprovedBy approvedByUserId={approvedBy} />
                      </Col>
                      <Col data-test-col-acquisitions-unit xs={3}>
                        <FieldSelection
                          dataOptions={acquisitionsUnits}
                          disabled
                          label={<FormattedMessage id="ui-invoice.invoice.acquisitionsUnit" />}
                          name="acquisitionsUnit"
                          required
                        />
                      </Col>
                      <Col data-test-col-sub-total xs={3}>
                        <Field
                          component={TextField}
                          label={<FormattedMessage id="ui-invoice.invoice.details.information.subTotal" />}
                          name="subTotal"
                          disabled
                          required
                          type="text"
                        />
                      </Col>
                      <Col data-test-col-adjustments-total xs={3}>
                        <Field
                          component={TextField}
                          label={<FormattedMessage id="ui-invoice.invoice.details.information.adjustment" />}
                          name="adjustmentsTotal"
                          disabled
                          required
                          type="text"
                        />
                      </Col>
                      <Col data-test-col-total xs={3}>
                        <Field
                          component={TextField}
                          label={<FormattedMessage id="ui-invoice.invoice.details.information.totalAmount" />}
                          name="total"
                          disabled
                          required
                          type="text"
                        />
                      </Col>
                      <Col data-test-col-bill-to-name xs={3}>
                        <FieldSelection
                          dataOptions={getAddressOptions(addresses)}
                          label={<FormattedMessage id="ui-invoice.invoice.billToName" />}
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
                    id={SECTIONS.adjustments}
                    label={<FormattedMessage id="ui-invoice.adjustments" />}
                  >
                    <AdjustmentsForm />
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
                          label={<FormattedMessage id="ui-invoice.invoice.vendorName" />}
                          name="vendorId"
                          disabled={isEditPostApproval}
                          required
                          validate={validateRequired}
                        />
                      </Col>
                      <Col data-test-col-accounting-code xs={3}>
                        <FieldSelection
                          dataOptions={[]}
                          disabled
                          label={<FormattedMessage id="ui-invoice.invoice.accountingCode" />}
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
                          disabled
                          required
                          type="text"
                        />
                      </Col>
                      <Col data-test-col-chk-subscription-overlap xs={3}>
                        <Field
                          component={Checkbox}
                          label={<FormattedMessage id="ui-invoice.invoice.chkSubscriptionOverlap" />}
                          name="chkSubscriptionOverlap"
                          disabled={isEditPostApproval}
                          type="checkbox"
                        />
                      </Col>
                      <Col data-test-col-currency xs={3}>
                        <FieldSelection
                          dataOptions={currenciesOptions}
                          label={<FormattedMessage id="ui-invoice.invoice.currency" />}
                          name="currency"
                          disabled={isEditPostApproval}
                          required
                          validate={validateRequired}
                        />
                      </Col>
                      <Col data-test-col-payment-method xs={3}>
                        <FieldSelection
                          dataOptions={PAYMENT_METHODS_OPTIONS}
                          id="invoice-payment-method"
                          label={<FormattedMessage id="ui-invoice.invoice.paymentMethod" />}
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
                          disabled={isEditPostApproval}
                          type="checkbox"
                        />
                      </Col>
                    </Row>
                  </Accordion>
                  {/* <Accordion
                    id={SECTIONS.voucherInformation}
                    label={<FormattedMessage id="ui-invoice.voucherInformation" />}
                  >
                    <Row>
                      <Col data-test-col-voucher-number xs={3}>
                        <Field
                          component={TextField}
                          label={<FormattedMessage id="ui-invoice.invoice.voucherNumber" />}
                          name="voucherNumber"
                          disabled={isEditPostApproval}
                          required
                          type="text"
                        // validate={validateRequired}
                        />
                      </Col>
                    </Row>
                  </Accordion> */}
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
