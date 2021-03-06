import React, { useState, useCallback, useRef } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { useHistory } from 'react-router';

import {
  find,
  get,
  isNumber,
} from 'lodash';

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
  getAccountingCodeOptions,
  getAddressOptions,
  IS_EDIT_POST_APPROVAL,
  isCancelled,
  isPaid,
  isPayable,
  parseAddressConfigs,
} from '../../common/utils';
import { ApprovedBy } from '../../common/components';
import {
  SECTIONS_INVOICE_FORM as SECTIONS,
} from '../constants';
import AdjustmentsForm from '../AdjustmentsForm';
import InvoiceLinksForm from './InvoiceLinksForm';
import InvoiceDocumentsForm from './InvoiceDocumentsForm';
import invoiceCss from '../Invoice.css';
import FieldBatchGroup from './FieldBatchGroup';

const CREATE_UNITS_PERM = 'invoices.acquisitions-units-assignments.assign';
const MANAGE_UNITS_PERM = 'invoices.acquisitions-units-assignments.manage';

const InvoiceForm = ({
  batchGroups,
  form: { batch, change, mutators: { push } },
  handleSubmit,
  initialValues,
  initialVendor,
  onCancel: closeForm,
  parentResources,
  pristine,
  submitting,
  values,
}) => {
  const history = useHistory();
  const accordionStatusRef = useRef();
  const filledBillTo = values?.billTo;
  const filledVendorId = values?.vendorId;
  const filledCurrency = values?.currency;
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
  } = initialValues;
  const [selectedVendor, setSelectedVendor] = useState();
  const [isLockTotalAmountEnabled, setLockTotalAmountEnabled] = useState(isNumber(lockTotal));
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
  const tooltipTextLockTotalAmount = !isLockTotalAmountEnabled &&
    <FormattedMessage id="ui-invoice.invoice.lockTotalAmount.tooltip" />;

  const resetLockTotalAmount = useCallback(() => change('lockTotal', null), [change]);

  const enableLockTotalAmount = useCallback(
    ({ target: { checked } }) => {
      setLockTotalAmountEnabled(checked);

      return checked ? undefined : resetLockTotalAmount();
    }, [resetLockTotalAmount],
  );

  const onChangeAccNumber = useCallback(accNumber => {
    const accCode = accNumber
      ? vendor.accounts?.find(({ accountNo }) => accountNo === accNumber)?.appSystemNo
      : vendor.erpCode;

    batch(() => {
      change('accountingCode', accCode || null);
      change('accountNo', accNumber || null);
    });
  }, [vendor.accounts, vendor.erpCode]);

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
            paneSub={initialVendor?.name}
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
                  <AccordionSet initialStatus={{ [SECTIONS.voucher]: false }}>
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
                            value={<FolioFormattedDate value={approvalDate} />}
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
                                key={isLockTotalAmountEnabled ? 1 : 0}
                                label={<FormattedMessage id="ui-invoice.invoice.lockTotalAmount" />}
                                name="lockTotal"
                                readOnly={!isLockTotalAmountEnabled}
                                required={isLockTotalAmountEnabled}
                                tooltipText={tooltipTextLockTotalAmount}
                                type="number"
                                validate={isLockTotalAmountEnabled ? validateRequired : undefined}
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
                                dataOptions={accountingCodeOptions}
                                labelId="ui-invoice.invoice.accountingCode"
                                name="accountNo"
                                onChange={onChangeAccNumber}
                                readOnly={!vendor?.id}
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
                            component={Checkbox}
                            label={<FormattedMessage id="ui-invoice.invoice.exportToAccounting" />}
                            name="exportToAccounting"
                            disabled={isEditPostApproval}
                            type="checkbox"
                            vertical
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
};

InvoiceForm.defaultProps = {
  initialVendor: {},
};

export default stripesForm({
  navigationCheck: true,
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
  subscription: { values: true },
})(InvoiceForm);
