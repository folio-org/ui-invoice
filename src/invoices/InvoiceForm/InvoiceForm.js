import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import {
  Field,
} from 'redux-form';

import {
  find,
  get,
} from 'lodash';

import {
  Accordion,
  AccordionSet,
  AccordionStatus,
  Checkbox,
  Col,
  currenciesOptions,
  ExpandAllButton,
  KeyValue,
  Pane,
  Paneset,
  Row,
  TextArea,
  TextField,
} from '@folio/stripes/components';
import stripesForm from '@folio/stripes/form';
import { ViewMetaData } from '@folio/stripes/smart-components';
import {
  AcqUnitsField,
  FieldDatepicker,
  FieldSelect,
  FieldSelection,
  FormFooter,
  PAYMENT_METHOD_OPTIONS,
  validateRequired,
  FieldOrganization,
} from '@folio/stripes-acq-components';

import { getSettingsAdjustmentsList } from '../../settings/adjustments/util';
import {
  INVOICE_STATUSES_OPTIONS,
  PRE_PAY_INVOICE_STATUSES_OPTIONS,
} from '../../common/constants';
import {
  getAccountingCodeOptions,
  getAddressOptions,
  IS_EDIT_POST_APPROVAL,
  isPaid,
  isPayable,
  parseAddressConfigs,
} from '../../common/utils';
import {
  ApprovedBy,
} from '../../common/components';
import {
  INVOICE_FORM,
  SECTIONS_INVOICE_FORM as SECTIONS,
} from '../constants';
import AdjustmentsForm from '../AdjustmentsForm';
import InvoiceLinksForm from './InvoiceLinksForm';
import InvoiceDocumentsForm from './InvoiceDocumentsForm';
import validate from './validate';
import invoiceCss from '../Invoice.css';
import FieldBatchGroup from './FieldBatchGroup';

const CREATE_UNITS_PERM = 'invoice.acquisitions-units-assignments.assign';
const MANAGE_UNITS_PERM = 'invoice.acquisitions-units-assignments.manage';

class InvoiceForm extends Component {
  static propTypes = {
    change: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    initialValues: PropTypes.object.isRequired,
    initialVendor: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    parentResources: PropTypes.object.isRequired,
    pristine: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
    filledBillTo: PropTypes.string,
    filledVendorId: PropTypes.string,
    filledCurrency: PropTypes.string.isRequired,
    batchGroups: PropTypes.arrayOf(PropTypes.object),
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedVendor: undefined,
    };
  }

  selectVendor = (vendor) => {
    const {
      dispatch,
      change,
    } = this.props;
    const { selectedVendor } = this.state;

    if (selectedVendor?.id !== vendor.id) {
      this.setState({ selectedVendor: vendor });

      const erpCode = vendor.erpCode;
      const hasAnyAccountingCode = vendor.accounts?.some(({ appSystemNo }) => Boolean(appSystemNo));
      const paymentMethod = vendor.paymentMethod;
      const accountingCode = hasAnyAccountingCode ? null : erpCode;

      dispatch(change('accountingCode', accountingCode || ''));
      dispatch(change('paymentMethod', paymentMethod || ''));
    }
  };

  closeForm = () => {
    this.props.onCancel();
  };

  render() {
    const {
      dispatch,
      change,
      handleSubmit,
      initialValues,
      initialVendor,
      parentResources,
      pristine,
      submitting,
      filledBillTo,
      filledVendorId,
      filledCurrency,
      batchGroups,
    } = this.props;
    const { selectedVendor } = this.state;
    const vendorInvoiceNo = get(initialValues, 'vendorInvoiceNo', '');
    const paneTitle = initialValues.id
      ? <FormattedMessage id="ui-invoice.invoice.paneTitle.edit" values={{ vendorInvoiceNo }} />
      : <FormattedMessage id="ui-invoice.invoice.paneTitle.create" />;
    const paneFooter = (
      <FormFooter
        id="clickable-save"
        label={<FormattedMessage id="ui-invoice.saveAndClose" />}
        pristine={pristine}
        submitting={submitting}
        handleSubmit={handleSubmit}
        onCancel={this.closeForm}
      />
    );
    const addresses = parseAddressConfigs(get(parentResources, 'configAddress.records'));
    const addressBillTo = get(find(addresses, { id: filledBillTo }), 'address', '');
    const isEditPostApproval = IS_EDIT_POST_APPROVAL(initialValues.id, initialValues.status);
    const metadata = initialValues.metadata;
    const approvedBy = get(initialValues, 'approvedBy');
    const isEditMode = Boolean(initialValues.id);
    const isStatusPaid = isPaid(initialValues.status);
    const vendor = selectedVendor || initialVendor;
    const accountingCodeOptions = getAccountingCodeOptions(vendor);
    const adjustmentsPresets = getSettingsAdjustmentsList(get(parentResources, ['configAdjustments', 'records'], []));

    const statusOptions = isPayable(initialValues.status) || isPaid(initialValues.status)
      ? INVOICE_STATUSES_OPTIONS
      : PRE_PAY_INVOICE_STATUSES_OPTIONS;

    return (
      <form style={{ height: '100vh' }}>
        <Paneset>
          <Pane
            defaultWidth="100%"
            dismissible
            footer={paneFooter}
            id="pane-invoice-form"
            onClose={this.closeForm}
            paneTitle={paneTitle}
          >
            <Row>
              <Col
                xs={12}
                md={8}
                mdOffset={2}
              >
                <AccordionStatus>
                  <Row end="xs">
                    <Col xs={12}>
                      <ExpandAllButton />
                    </Col>
                  </Row>
                  <AccordionSet initialStatus={{ [SECTIONS.voucher]: false }}>
                    <Accordion
                      id={SECTIONS.information}
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
                            id="paymentTerms"
                            name="paymentTerms"
                            disabled={isEditPostApproval}
                            type="text"
                          />
                        </Col>
                        <Col data-test-col-status xs={3}>
                          <FieldSelection
                            dataOptions={statusOptions}
                            disabled={isStatusPaid}
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
                            disabled
                          />
                        </Col>
                        <Col data-test-col-approved-by xs={3}>
                          <ApprovedBy approvedByUserId={approvedBy} />
                        </Col>
                        <Col data-test-col-acquisitions-unit xs={3}>
                          <AcqUnitsField
                            name="acqUnitIds"
                            perm={isEditMode ? MANAGE_UNITS_PERM : CREATE_UNITS_PERM}
                            isEdit={isEditMode}
                            preselectedUnits={initialValues.acqUnitIds}
                          />
                        </Col>
                        <Col data-test-col-sub-total xs={3}>
                          <Field
                            component={TextField}
                            label={<FormattedMessage id="ui-invoice.invoice.details.information.subTotal" />}
                            id="subTotal"
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
                            id="adjustmentsTotal"
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
                            id="total"
                            name="total"
                            disabled
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
                          className={invoiceCss.addressWrapper}
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
                            id="note"
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
                            vertical
                          />
                        </Col>
                        <Col data-test-col-batch-group xs={3}>
                          <FieldBatchGroup
                            batchGroups={batchGroups}
                            isEditPostApproval={isEditPostApproval}
                          />
                        </Col>
                      </Row>
                    </Accordion>
                    <Accordion
                      id={SECTIONS.adjustments}
                      label={<FormattedMessage id="ui-invoice.adjustments" />}
                    >
                      <AdjustmentsForm
                        adjustmentsPresets={adjustmentsPresets}
                        currency={filledCurrency}
                        disabled={isEditPostApproval}
                        invoiceSubTotal={initialValues.subTotal}
                      />
                    </Accordion>
                    <Accordion
                      id={SECTIONS.vendorDetails}
                      label={<FormattedMessage id="ui-invoice.vendorInformation" />}
                    >
                      <Row>
                        <Col data-test-col-vendor-invoice-no xs={3}>
                          <Field
                            component={TextField}
                            label={<FormattedMessage id="ui-invoice.invoice.vendorInvoiceNo" />}
                            id="vendorInvoiceNo"
                            name="vendorInvoiceNo"
                            required
                            type="text"
                            validate={validateRequired}
                          />
                        </Col>

                        <Col xs={6}>
                          <FieldOrganization
                            dispatch={dispatch}
                            change={change}
                            disabled={isEditPostApproval}
                            id={filledVendorId}
                            labelId="ui-invoice.invoice.vendorName"
                            name="vendorId"
                            onSelect={this.selectVendor}
                            required
                          />
                        </Col>

                        <Col data-test-col-accounting-code xs={3}>
                          <FieldSelection
                            dataOptions={accountingCodeOptions}
                            disabled={isEditPostApproval || !vendor}
                            labelId="ui-invoice.invoice.accountingCode"
                            name="accountingCode"
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
                            id="folioInvoiceNo"
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
                            vertical
                          />
                        </Col>
                        <Col data-test-col-currency xs={3}>
                          <FieldSelection
                            dataOptions={currenciesOptions}
                            labelId="ui-invoice.invoice.currency"
                            name="currency"
                            disabled={isEditPostApproval}
                            required
                            validate={validateRequired}
                          />
                        </Col>
                        <Col data-test-col-payment-method xs={3}>
                          <FieldSelect
                            dataOptions={PAYMENT_METHOD_OPTIONS}
                            id="invoice-payment-method"
                            label={<FormattedMessage id="ui-invoice.invoice.paymentMethod" />}
                            name="paymentMethod"
                            required
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
                      id={SECTIONS.voucher}
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
                    <Accordion
                      id={SECTIONS.documents}
                      label={<FormattedMessage id="ui-invoice.linksAndDocuments" />}
                    >
                      <Row>
                        <Col xs={12}>
                          <InvoiceLinksForm />
                        </Col>
                      </Row>

                      <Row>
                        <Col xs={12}>
                          <InvoiceDocumentsForm
                            dispatch={dispatch}
                          />
                        </Col>
                      </Row>
                    </Accordion>
                  </AccordionSet>
                </AccordionStatus>
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
  enableReinitialize: true,
  validate,
})(InvoiceForm);
