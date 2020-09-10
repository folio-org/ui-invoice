import React, { useState, useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';

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
  ExpandAllButton,
  KeyValue,
  NoValue,
  Pane,
  Paneset,
  Row,
  TextArea,
  TextField,
  useCurrencyOptions,
} from '@folio/stripes/components';
import stripesForm from '@folio/stripes/final-form';
import { ViewMetaData } from '@folio/stripes/smart-components';
import {
  AcqUnitsField,
  AmountWithCurrencyField,
  FieldDatepickerFinal,
  FieldSelectFinal,
  FieldSelectionFinal,
  FormFooter,
  PAYMENT_METHOD_OPTIONS,
  validateRequired,
  FieldOrganization,
  OrganizationValue,
} from '@folio/stripes-acq-components';

import { getSettingsAdjustmentsList } from '../../settings/adjustments/util';
import {
  INVOICE_STATUSES_OPTIONS,
  PRE_PAY_INVOICE_STATUSES_OPTIONS,
} from '../../common/constants';
import {
  formatDate,
  getAccountingCodeOptions,
  getAddressOptions,
  IS_EDIT_POST_APPROVAL,
  isCancelled,
  isPaid,
  isPayable,
  parseAddressConfigs,
} from '../../common/utils';
import {
  ApprovedBy,
} from '../../common/components';
import {
  SECTIONS_INVOICE_FORM as SECTIONS,
} from '../constants';
import AdjustmentsDetails from '../AdjustmentsDetails';
import AdjustmentsForm from '../AdjustmentsForm';
import BatchGroupValue from '../InvoiceDetails/BatchGroupValue';
import InvoiceLinksForm from './InvoiceLinksForm';
import InvoiceDocumentsForm from './InvoiceDocumentsForm';
import invoiceCss from '../Invoice.css';
import FieldBatchGroup from './FieldBatchGroup';
import CurrentExchangeRate from './CurrentExchangeRate';

const CREATE_UNITS_PERM = 'invoice.acquisitions-units-assignments.assign';
const MANAGE_UNITS_PERM = 'invoice.acquisitions-units-assignments.manage';

const InvoiceForm = ({
  batchGroups,
  form: { change, mutators: { push } },
  handleSubmit,
  initialValues,
  initialVendor,
  onCancel: closeForm,
  parentResources,
  pristine,
  submitting,
  systemCurrency,
  values,
}) => {
  const filledBillTo = values?.billTo;
  const filledVendorId = values?.vendorId;
  const filledCurrency = values?.currency;
  const {
    accountingCode,
    acqUnitIds,
    adjustments,
    adjustmentsTotal,
    approvalDate,
    approvedBy,
    batchGroupId,
    currency,
    exchangeRate,
    folioInvoiceNo,
    id,
    invoiceDate,
    metadata,
    paymentTerms,
    status,
    subTotal,
    total,
    vendorId,
    vendorInvoiceNo,
  } = initialValues;
  const [selectedVendor, setSelectedVendor] = useState();
  const [isExchangeRateVisible, setExchangeRateVisible] = useState(Boolean(exchangeRate));
  const selectVendor = useCallback((vendor) => {
    if (selectedVendor?.id !== vendor.id) {
      setSelectedVendor(vendor);

      const erpCode = vendor.erpCode;
      const hasAnyAccountingCode = vendor.accounts?.some(({ appSystemNo }) => Boolean(appSystemNo));
      const paymentMethod = vendor.paymentMethod;
      const vendorAccountingCode = hasAnyAccountingCode ? null : erpCode;
      const exportToAccounting = Boolean(vendor.exportToAccounting);

      change('accountingCode', vendorAccountingCode || null);
      change('paymentMethod', paymentMethod || null);
      change('exportToAccounting', exportToAccounting);
    }
  }, [change, selectedVendor]);

  const currenciesOptions = useCurrencyOptions();
  const paneTitle = id
    ? <FormattedMessage id="ui-invoice.invoice.paneTitle.edit" values={{ vendorInvoiceNo }} />
    : <FormattedMessage id="ui-invoice.invoice.paneTitle.create" />;
  const paneFooter = (
    <FormFooter
      id="clickable-save"
      label={<FormattedMessage id="ui-invoice.saveAndClose" />}
      pristine={pristine}
      submitting={submitting}
      handleSubmit={handleSubmit}
      onCancel={closeForm}
    />
  );
  const addresses = parseAddressConfigs(get(parentResources, 'configAddress.records'));
  const addressBillTo = get(find(addresses, { id: filledBillTo }), 'address', '');
  const isEditPostApproval = IS_EDIT_POST_APPROVAL(id, status);
  const isEditMode = Boolean(id);
  const isStatusPaid = isPaid(status);
  const vendor = selectedVendor || initialVendor;
  const accountingCodeOptions = getAccountingCodeOptions(vendor);
  const adjustmentsPresets = getSettingsAdjustmentsList(get(parentResources, ['configAdjustments', 'records'], []));

  const statusOptions = isPayable(status) || isStatusPaid || isCancelled(status)
    ? INVOICE_STATUSES_OPTIONS
    : PRE_PAY_INVOICE_STATUSES_OPTIONS;
  const isCurrentExchangeRateVisible = filledCurrency !== systemCurrency;

  const resetExchangeRate = useCallback(() => change('exchangeRate', null), [change]);

  const showExchangeRate = useCallback(
    ({ target: { checked } }) => {
      setExchangeRateVisible(checked);

      return checked ? undefined : resetExchangeRate();
    },
    [resetExchangeRate],
  );

  const onChangeCurrency = useCallback((value) => {
    change('currency', value);
    if (value === systemCurrency) {
      resetExchangeRate();
    }
  }, [change, resetExchangeRate, systemCurrency]);

  return (
    <form style={{ height: '100vh' }}>
      <Paneset>
        <Pane
          defaultWidth="100%"
          dismissible
          footer={paneFooter}
          id="pane-invoice-form"
          onClose={closeForm}
          paneTitle={paneTitle}
          paneSub={initialVendor?.name}
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
                        {isEditPostApproval
                          ? (
                            <KeyValue
                              label={<FormattedMessage id="ui-invoice.invoice.details.information.invoiceDate" />}
                              value={formatDate(invoiceDate)}
                            />
                          )
                          : (
                            <FieldDatepickerFinal
                              labelId="ui-invoice.invoice.details.information.invoiceDate"
                              name="invoiceDate"
                              required
                              validate={validateRequired}
                            />
                          )
                        }
                      </Col>
                      <Col data-test-col-status xs={3}>
                        {isEditPostApproval
                          ? (
                            <KeyValue
                              label={<FormattedMessage id="ui-invoice.invoice.details.information.status" />}
                              value={status}
                            />
                          )
                          : (
                            <FieldSelectionFinal
                              dataOptions={statusOptions}
                              id="invoice-status"
                              labelId="ui-invoice.invoice.details.information.status"
                              name="status"
                              required
                              validate={validateRequired}
                            />
                          )
                        }
                      </Col>
                      <Col data-test-col-payment-due xs={3}>
                        <FieldDatepickerFinal
                          labelId="ui-invoice.invoice.details.information.paymentDue"
                          name="paymentDue"
                        />
                      </Col>
                      <Col data-test-col-payment-terms xs={3}>
                        {isEditPostApproval
                          ? (
                            <KeyValue
                              label={<FormattedMessage id="ui-invoice.invoice.paymentTerms" />}
                              value={paymentTerms || <NoValue />}
                            />
                          )
                          : (
                            <Field
                              component={TextField}
                              label={<FormattedMessage id="ui-invoice.invoice.paymentTerms" />}
                              id="paymentTerms"
                              name="paymentTerms"
                              type="text"
                            />
                          )
                        }
                      </Col>
                    </Row>

                    <Row>
                      <Col data-test-col-approval-date xs={3}>
                        <KeyValue
                          label={<FormattedMessage id="ui-invoice.invoice.approvalDate" />}
                          value={approvalDate ? formatDate(approvalDate) : <NoValue />}
                        />
                      </Col>
                      <Col data-test-col-approved-by xs={3}>
                        <ApprovedBy approvedByUserId={approvedBy} />
                      </Col>
                      <Col data-test-col-acquisitions-unit xs={3}>
                        <AcqUnitsField
                          name="acqUnitIds"
                          perm={isEditMode ? MANAGE_UNITS_PERM : CREATE_UNITS_PERM}
                          id="invoice-acq-units"
                          isEdit={isEditMode}
                          isFinal
                          preselectedUnits={acqUnitIds}
                        />
                      </Col>
                    </Row>

                    <Row>
                      <Col data-test-col-bill-to-name xs={3}>
                        <FieldSelectionFinal
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
                          value={addressBillTo || <NoValue />}
                        />
                      </Col>
                      <Col data-test-col-batch-group xs={3}>
                        {isEditPostApproval
                          ? (
                            <BatchGroupValue
                              label={<FormattedMessage id="ui-invoice.invoice.details.information.batchGroup" />}
                              id={batchGroupId}
                            />
                          )
                          : <FieldBatchGroup batchGroups={batchGroups} />
                        }
                      </Col>
                    </Row>

                    <Row>
                      <Col data-test-col-sub-total xs={3}>
                        <KeyValue label={<FormattedMessage id="ui-invoice.invoice.details.information.subTotal" />}>
                          <AmountWithCurrencyField
                            amount={subTotal}
                            currency={filledCurrency}
                          />
                        </KeyValue>
                      </Col>
                      <Col data-test-col-adjustments-total xs={3}>
                        <KeyValue label={<FormattedMessage id="ui-invoice.invoice.details.information.adjustment" />}>
                          <AmountWithCurrencyField
                            amount={adjustmentsTotal}
                            currency={filledCurrency}
                          />
                        </KeyValue>
                      </Col>
                      <Col data-test-col-total xs={3}>
                        <KeyValue label={<FormattedMessage id="ui-invoice.invoice.details.information.totalAmount" />}>
                          <AmountWithCurrencyField
                            amount={total}
                            currency={filledCurrency}
                          />
                        </KeyValue>
                      </Col>
                      <Col data-test-col-lock-total xs={3}>
                        <Field
                          component={Checkbox}
                          disabled={isEditPostApproval}
                          label={<FormattedMessage id="ui-invoice.invoice.lockTotal" />}
                          name="lockTotal"
                          type="checkbox"
                          vertical
                        />
                      </Col>
                    </Row>

                    <Row>
                      <Col data-test-col-note xs={3}>
                        <Field
                          component={TextArea}
                          label={<FormattedMessage id="ui-invoice.invoice.note" />}
                          id="note"
                          name="note"
                          type="text"
                        />
                      </Col>
                    </Row>
                  </Accordion>
                  <Accordion
                    id={SECTIONS.adjustments}
                    label={<FormattedMessage id="ui-invoice.adjustments" />}
                  >
                    {isEditPostApproval
                      ? (
                        <AdjustmentsDetails
                          adjustments={adjustments}
                          currency={currency}
                        />
                      )
                      : (
                        <AdjustmentsForm
                          adjustmentsPresets={adjustmentsPresets}
                          currency={filledCurrency}
                          change={change}
                          invoiceSubTotal={subTotal}
                        />
                      )
                    }
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
                        {isEditPostApproval
                          ? (
                            <OrganizationValue
                              label={<FormattedMessage id="ui-invoice.invoice.vendorName" />}
                              id={vendorId}
                            />
                          )
                          : (
                            <FieldOrganization
                              change={change}
                              id={filledVendorId}
                              labelId="ui-invoice.invoice.vendorName"
                              name="vendorId"
                              onSelect={selectVendor}
                              required
                            />
                          )
                        }
                      </Col>

                      <Col data-test-col-accounting-code xs={3}>
                        {isEditPostApproval
                          ? (
                            <KeyValue
                              label={<FormattedMessage id="ui-invoice.invoice.accountingCode" />}
                              value={accountingCode || <NoValue />}
                            />
                          )
                          : (
                            <FieldSelectionFinal
                              dataOptions={accountingCodeOptions}
                              disabled={isEditPostApproval || !vendor}
                              labelId="ui-invoice.invoice.accountingCode"
                              name="accountingCode"
                            />
                          )
                        }
                      </Col>
                    </Row>
                  </Accordion>
                  <Accordion
                    id={SECTIONS.extendedInformation}
                    label={<FormattedMessage id="ui-invoice.extendedInformation" />}
                  >
                    <Row>
                      <Col data-test-col-folio-invoice-no xs={3}>
                        <KeyValue
                          label={<FormattedMessage id="ui-invoice.invoice.folioInvoiceNo" />}
                          value={folioInvoiceNo || <NoValue />}
                        />
                      </Col>
                      <Col data-test-col-payment-method xs={3}>
                        <FieldSelectFinal
                          dataOptions={PAYMENT_METHOD_OPTIONS}
                          id="invoice-payment-method"
                          label={<FormattedMessage id="ui-invoice.invoice.paymentMethod" />}
                          name="paymentMethod"
                          required
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
                      <Col data-test-col-export-to-accounting xs={3}>
                        <Field
                          component={Checkbox}
                          label={<FormattedMessage id="ui-invoice.invoice.exportToAccounting" />}
                          name="exportToAccounting"
                          disabled={isEditPostApproval}
                          type="checkbox"
                          vertical
                        />
                      </Col>
                      <Col data-test-col-currency xs={3}>
                        {isEditPostApproval
                          ? (
                            <KeyValue
                              label={<FormattedMessage id="ui-invoice.invoice.currency" />}
                              value={currency}
                            />
                          )
                          : (
                            <FieldSelectionFinal
                              dataOptions={currenciesOptions}
                              id="invoice-currency"
                              labelId="ui-invoice.invoice.currency"
                              name="currency"
                              onChange={onChangeCurrency}
                              required
                              validate={validateRequired}
                            />
                          )
                        }
                      </Col>
                      {isCurrentExchangeRateVisible && (
                        <>
                          <Col data-test-col-current-exchange-rate xs={3}>
                            <CurrentExchangeRate
                              label={<FormattedMessage id="ui-invoice.invoice.currentExchangeRate" />}
                              exchangeFrom={filledCurrency}
                              exchangeTo={systemCurrency}
                            />
                          </Col>
                          <Col data-test-col-use-set-exchange-rate xs={3}>
                            <Checkbox
                              checked={isExchangeRateVisible}
                              disabled={isEditPostApproval}
                              id="use-set-exhange-rate"
                              label={<FormattedMessage id="ui-invoice.invoice.useSetExchangeRate" />}
                              onChange={showExchangeRate}
                              vertical
                            />
                          </Col>
                          {isExchangeRateVisible && (
                            <Col data-test-col-set-exchange-rate xs={3}>
                              <Field
                                component={TextField}
                                label={<FormattedMessage id="ui-invoice.invoice.setExchangeRate" />}
                                id="exchange-rate"
                                name="exchangeRate"
                                type="number"
                              />
                            </Col>
                          )}
                        </>
                      )}
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
                          push={push}
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
};

InvoiceForm.propTypes = {
  initialValues: PropTypes.object.isRequired,
  initialVendor: PropTypes.object,
  handleSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  parentResources: PropTypes.object.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  batchGroups: PropTypes.arrayOf(PropTypes.object),
  systemCurrency: PropTypes.string.isRequired,
  values: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
};

export default stripesForm({
  navigationCheck: true,
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
  subscription: { values: true },
})(InvoiceForm);
