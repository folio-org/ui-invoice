import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { useHistory } from 'react-router';

import {
  find,
  get,
  isNumber,
  noop,
} from 'lodash';

import { IfPermission } from '@folio/stripes/core';
import {
  Accordion,
  AccordionSet,
  AccordionStatus,
  Checkbox,
  checkScope,
  Col,
  collapseAllSections,
  ExpandAllButton,
  expandAllSections,
  HasCommand,
  KeyValue,
  Pane,
  Paneset,
  Row,
  TextArea,
} from '@folio/stripes/components';
import stripesForm from '@folio/stripes/final-form';
import { ViewMetaData } from '@folio/stripes/smart-components';
import {
  AcqUnitsField,
  AmountWithCurrencyField,
  CurrencyExchangeRateFields,
  FieldDatepickerFinal,
  FieldOrganization,
  FieldSelectFinal,
  FieldSelectionFinal,
  FolioFormattedDate,
  FormFooter,
  handleKeyCommand,
  PAYMENT_METHOD_OPTIONS,
  TextField,
  validateRequired,
} from '@folio/stripes-acq-components';

import { getSettingsAdjustmentsList } from '../../settings/adjustments/util';
import {
  INVOICE_STATUSES_OPTIONS,
  PRE_PAY_INVOICE_STATUSES_OPTIONS,
} from '../../common/constants';
import {
  NO_ACCOUNT_NUMBER,
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
  FieldFiscalYearContainer as FieldFiscalYear,
  VendorPrimaryAddress,
} from '../../common/components';
import {
  SECTIONS_INVOICE_FORM as SECTIONS,
} from '../constants';
import AdjustmentsForm from '../AdjustmentsForm';
import InvoiceLinksForm from './InvoiceLinksForm';
import InvoiceDocumentsForm from './InvoiceDocumentsForm';
import invoiceCss from '../Invoice.css';
import FieldBatchGroup from './FieldBatchGroup';
import { validateAccountingCode } from './utils';

const CREATE_UNITS_PERM = 'invoices.acquisitions-units-assignments.assign';
const MANAGE_UNITS_PERM = 'invoices.acquisitions-units-assignments.manage';

const InvoiceForm = ({
  batchGroups,
  form,
  handleSubmit,
  initialValues,
  initialVendor,
  isCreateFromOrder,
  onCancel: closeForm,
  parentResources,
  pristine,
  saveButtonLabelId,
  submitting,
  values,
}) => {
  const intl = useIntl();
  const history = useHistory();
  const accordionStatusRef = useRef();

  const {
    batch,
    change,
    mutators: { push },
    registerField,
  } = form;

  const filledBillTo = values?.billTo;
  const filledVendorId = values?.vendorId;
  const filledCurrency = values?.currency;
  const isExportToAccountingChecked = values?.exportToAccounting ||
    values?.adjustments?.some(({ exportToAccounting }) => exportToAccounting);
  const {
    acqUnitIds,
    adjustments,
    adjustmentsTotal,
    approvalDate,
    approvedBy,
    currency,
    exchangeRate,
    folioInvoiceNo,
    id,
    lockTotal,
    metadata,
    status,
    subTotal,
    total,
    vendorInvoiceNo,
    fiscalYearId,
  } = initialValues;
  const [selectedVendor, setSelectedVendor] = useState();
  const [isLockTotalAmountEnabled, setLockTotalAmountEnabled] = useState(isNumber(lockTotal));

  useEffect(() => {
    const unregisterAccountingCodeField = registerField('accountingCode', noop);

    return () => {
      unregisterAccountingCodeField();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectVendor = useCallback((vendor) => {
    if (selectedVendor?.id !== vendor.id) {
      setSelectedVendor(vendor);

      const erpCode = vendor.erpCode;
      const hasAnyAccountingCode = vendor.accounts?.some(({ appSystemNo }) => Boolean(appSystemNo));
      const paymentMethod = vendor.paymentMethod;
      const vendorAccountingCode = hasAnyAccountingCode ? null : erpCode;
      const accountNo = hasAnyAccountingCode ? null : NO_ACCOUNT_NUMBER;
      const exportToAccounting = Boolean(vendor.exportToAccounting);

      batch(() => {
        change('accountingCode', vendorAccountingCode || null);
        change('accountNo', accountNo);
        change('paymentMethod', paymentMethod || null);
        change('exportToAccounting', exportToAccounting);
      });
    }
  }, [change, batch, selectedVendor]);

  useEffect(() => {
    if (isCreateFromOrder) selectVendor(initialVendor);
  }, [isCreateFromOrder, initialVendor, selectVendor]);

  const paneTitle = id
    ? <FormattedMessage id="ui-invoice.invoice.paneTitle.edit" values={{ vendorInvoiceNo }} />
    : <FormattedMessage id="ui-invoice.invoice.paneTitle.create" />;
  const paneFooter = (
    <FormFooter
      id="clickable-save"
      label={<FormattedMessage id={saveButtonLabelId} />}
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
  const invoiceVendor = selectedVendor || initialVendor;
  const isFiscalYearRequired = isEditMode && Boolean(fiscalYearId);
  const isFiscalYearChanged = values?.fiscalYearId && (fiscalYearId !== values?.fiscalYearId);
  const accountingCodeOptions = getAccountingCodeOptions(invoiceVendor, intl);
  const adjustmentsPresets = getSettingsAdjustmentsList(get(parentResources, ['configAdjustments', 'records'], []));
  const accountingCodeValidationProps = isExportToAccountingChecked
    ? { required: true, validate: validateAccountingCode, key: 1 }
    : { key: 0 };

  const statusOptions = isPayable(status) || isStatusPaid || isCancelled(status)
    ? INVOICE_STATUSES_OPTIONS
    : PRE_PAY_INVOICE_STATUSES_OPTIONS;
  const tooltipTextLockTotalAmount = !isLockTotalAmountEnabled &&
    <FormattedMessage id="ui-invoice.invoice.lockTotalAmount.tooltip" />;
  const lockTotalAmountProps = isLockTotalAmountEnabled
    ? {
      key: 1,
      required: true,
      validate: validateRequired,
    }
    : {
      key: 0,
      readOnly: true,
    };
  const isFiscalYearFieldDisabled = isPayable(status) || isStatusPaid || isCancelled(status);

  const resetLockTotalAmount = useCallback(() => change('lockTotal', null), [change]);

  const enableLockTotalAmount = useCallback(
    ({ target: { checked } }) => {
      setLockTotalAmountEnabled(checked);

      return checked ? undefined : resetLockTotalAmount();
    }, [resetLockTotalAmount],
  );

  /**
   * The values of the options are a vendor's account numbers, which are used to determine the corresponding accounting codes of the accounts.
   *
   * NO_ACCOUNT_NUMBER is used to indicate that the invoice accounting code value is the default organization accounting code (erpCode) and there is no account number value.
   */
  const onChangeAccNumber = useCallback(accNumber => {
    const accCode = accNumber !== NO_ACCOUNT_NUMBER
      ? invoiceVendor.accounts?.find(({ accountNo }) => accountNo === accNumber)?.appSystemNo
      : invoiceVendor.erpCode;

    batch(() => {
      change('accountingCode', accCode || null);
      change('accountNo', accNumber || null);
    });
  }, [batch, change, invoiceVendor.accounts, invoiceVendor.erpCode]);

  const shortcuts = [
    {
      name: 'cancel',
      shortcut: 'esc',
      handler: handleKeyCommand(closeForm),
    },
    {
      name: 'save',
      handler: handleKeyCommand(handleSubmit, { disabled: pristine || submitting }),
    },
    {
      name: 'expandAllSections',
      handler: (e) => expandAllSections(e, accordionStatusRef),
    },
    {
      name: 'collapseAllSections',
      handler: (e) => collapseAllSections(e, accordionStatusRef),
    },
    {
      name: 'search',
      handler: handleKeyCommand(() => history.push('/invoice')),
    },
  ];

  return (
    <form style={{ height: '100vh' }}>
      <HasCommand
        commands={shortcuts}
        isWithinScope={checkScope}
        scope={document.body}
      >
        <Paneset>
          <Pane
            defaultWidth="100%"
            dismissible
            footer={paneFooter}
            id="pane-invoice-form"
            onClose={closeForm}
            paneTitle={paneTitle}
            paneSub={initialVendor?.code}
          >
            <Row>
              <Col
                xs={12}
                md={8}
                mdOffset={2}
              >
                <AccordionStatus ref={accordionStatusRef}>
                  <Row end="xs">
                    <Col xs={12}>
                      <ExpandAllButton />
                    </Col>
                  </Row>
                  <AccordionSet
                    initialStatus={{ [SECTIONS.voucher]: false }}
                    id="invoice-form-accordion-set"
                  >
                    <Accordion
                      id={SECTIONS.information}
                      label={<FormattedMessage id="ui-invoice.invoiceInformation" />}
                    >
                      {metadata && <ViewMetaData metadata={metadata} />}
                      <Row>
                        <Col data-test-col-invoice-date xs={3}>
                          <FieldDatepickerFinal
                            isNonInteractive={isEditPostApproval}
                            labelId="ui-invoice.invoice.details.information.invoiceDate"
                            name="invoiceDate"
                            required
                            validate={validateRequired}
                          />
                        </Col>
                        <IfPermission perm="ui-invoice.payDifferentFY">
                          <Col xs={3}>
                            <FieldFiscalYear
                              id="invoice-fiscal-year"
                              name="fiscalYearId"
                              disabled={isFiscalYearFieldDisabled}
                              required={isFiscalYearRequired}
                            />
                          </Col>
                        </IfPermission>
                        <Col data-test-col-status xs={3}>
                          <FieldSelectionFinal
                            dataOptions={statusOptions}
                            id="invoice-status"
                            isNonInteractive={isEditPostApproval}
                            labelId="ui-invoice.invoice.details.information.status"
                            name="status"
                            required
                            validate={validateRequired}
                          />
                        </Col>
                        <Col data-test-col-payment-due xs={3}>
                          <FieldDatepickerFinal
                            labelId="ui-invoice.invoice.details.information.paymentDue"
                            name="paymentDue"
                          />
                        </Col>
                        <Col data-test-col-payment-terms xs={3}>
                          <Field
                            component={TextField}
                            id="paymentTerms"
                            isNonInteractive={isEditPostApproval}
                            label={<FormattedMessage id="ui-invoice.invoice.paymentTerms" />}
                            name="paymentTerms"
                            type="text"
                          />
                        </Col>
                      </Row>

                      <Row>
                        <Col data-test-col-approval-date xs={3}>
                          <KeyValue
                            label={<FormattedMessage id="ui-invoice.invoice.approvalDate" />}
                            value={<FolioFormattedDate value={approvalDate} utc={false} />}
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
                            labelId="ui-invoice.invoice.billTo"
                            name="billTo"
                          />
                        </Col>
                        <Col
                          className={invoiceCss.addressWrapper}
                          xs={3}
                        >
                          <KeyValue
                            label={<FormattedMessage id="ui-invoice.invoice.address" />}
                            value={addressBillTo}
                          />
                        </Col>
                        <Col data-test-col-batch-group xs={3}>
                          <FieldBatchGroup
                            batchGroups={batchGroups}
                            isNonInteractive={isEditPostApproval}
                          />
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
                          <KeyValue label={<FormattedMessage id="ui-invoice.invoice.details.information.calculatedTotalAmount" />}>
                            <AmountWithCurrencyField
                              amount={total}
                              currency={filledCurrency}
                            />
                          </KeyValue>
                        </Col>
                      </Row>

                      <Row>
                        <Col data-test-col-lock-total xs={3}>
                          <Checkbox
                            checked={isLockTotalAmountEnabled}
                            data-testid="lock-total"
                            disabled={isEditPostApproval}
                            id="lock-total"
                            label={<FormattedMessage id="ui-invoice.invoice.lockTotal" />}
                            onChange={enableLockTotalAmount}
                            vertical
                          />
                        </Col>
                        <Col data-test-col-lock-total-amount xs={3}>
                          {isEditPostApproval
                            ? (
                              <KeyValue label={<FormattedMessage id="ui-invoice.invoice.lockTotalAmount" />}>
                                <AmountWithCurrencyField
                                  amount={lockTotal}
                                  currency={currency}
                                />
                              </KeyValue>
                            )
                            : (
                              <Field
                                component={TextField}
                                data-testid="lock-total-amount"
                                id="lock-total-amount"
                                label={<FormattedMessage id="ui-invoice.invoice.lockTotalAmount" />}
                                name="lockTotal"
                                tooltipText={tooltipTextLockTotalAmount}
                                type="number"
                                {...lockTotalAmountProps}
                              />
                            )
                          }
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
                      </Row>
                    </Accordion>
                    <Accordion
                      id={SECTIONS.adjustments}
                      label={<FormattedMessage id="ui-invoice.adjustments" />}
                    >
                      <AdjustmentsForm
                        adjustmentsPresets={adjustmentsPresets}
                        currency={filledCurrency}
                        change={change}
                        invoiceSubTotal={subTotal}
                        isNonInteractive={isEditPostApproval}
                        initialCurrency={currency}
                        initialAdjustments={adjustments}
                        fiscalYearId={values.fiscalYearId}
                        adjustments={values.adjustments}
                        isFiscalYearChanged={isFiscalYearChanged}
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
                            change={change}
                            disabled={isCreateFromOrder}
                            id={filledVendorId}
                            labelId="ui-invoice.invoice.vendorName"
                            name="vendorId"
                            onSelect={selectVendor}
                            required
                            isNonInteractive={isEditPostApproval}
                          />
                        </Col>

                        <Col data-test-col-accounting-code xs={3}>
                          {isEditPostApproval
                            ? (
                              <KeyValue
                                label={<FormattedMessage id="ui-invoice.invoice.accountingCode" />}
                                value={values?.accountingCode}
                              />
                            )
                            : (
                              <FieldSelectionFinal
                                id="accounting-code-selection"
                                data-testid="accounting-code"
                                dataOptions={accountingCodeOptions}
                                labelId="ui-invoice.invoice.accountingCode"
                                name="accountNo"
                                onChange={onChangeAccNumber}
                                readOnly={!invoiceVendor?.id}
                                {...accountingCodeValidationProps}
                              />
                            )
                          }
                        </Col>

                        <Col xs={12}>
                          <VendorPrimaryAddress vendor={invoiceVendor} />
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
                            value={folioInvoiceNo}
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
                            data-testid="export-to-accounting"
                            component={Checkbox}
                            label={<FormattedMessage id="ui-invoice.invoice.exportToAccounting" />}
                            name="exportToAccounting"
                            disabled={isEditPostApproval}
                            type="checkbox"
                            vertical
                            validateFields={['accountNo']}
                          />
                        </Col>
                        <Col data-test-col-enclosure-needed xs={3}>
                          <Field
                            component={Checkbox}
                            label={<FormattedMessage id="ui-invoice.invoice.enclosureNeeded" />}
                            name="enclosureNeeded"
                            disabled={isEditPostApproval}
                            type="checkbox"
                            vertical
                          />
                        </Col>
                      </Row>
                      <CurrencyExchangeRateFields
                        exchangeRate={exchangeRate}
                        initialCurrency={currency}
                        isNonInteractive={isEditPostApproval}
                        isTooltipTextExchangeRate={!isEditPostApproval}
                        isUseExangeRateDisabled={isEditPostApproval}
                        isSetExchangeRateNonIntaractive={isStatusPaid}
                      />
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
      </HasCommand>
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
  values: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  isCreateFromOrder: PropTypes.bool,
  saveButtonLabelId: PropTypes.string,
};

InvoiceForm.defaultProps = {
  initialVendor: {},
  isCreateFromOrder: false,
  saveButtonLabelId: 'ui-invoice.saveAndClose',
};

export default stripesForm({
  navigationCheck: true,
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
  subscription: { values: true },
})(InvoiceForm);
