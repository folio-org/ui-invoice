import React, { useCallback, useRef } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { useHistory } from 'react-router';

import {
  find,
  get,
  uniq,
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
} from '@folio/stripes/components';
import stripesForm from '@folio/stripes/final-form';
import { ViewMetaData } from '@folio/stripes/smart-components';
import {
  AmountWithCurrencyField,
  FieldDatepickerFinal,
  FieldSelectionFinal,
  FormFooter,
  FundDistributionFieldsFinal,
  handleKeyCommand,
  parseNumberFieldValue,
  TextField,
  validateRequired,
  validateRequiredNumber,
  VendorReferenceNumbersFields,
} from '@folio/stripes-acq-components';

import {
  StatusValue,
} from '../../common/components';
import {
  calculateTotalAmount,
  getAccountNumberOptions,
  IS_EDIT_POST_APPROVAL,
} from '../../common/utils';
import {
  convertToInvoiceLineFields,
} from '../utils';
import AdjustmentsForm from '../AdjustmentsForm';
import {
  SECTIONS_INVOICE_LINE_FORM as SECTIONS,
} from '../constants';
import { POLineField } from './POLineField';

const InvoiceLineForm = ({
  initialValues,
  handleSubmit,
  onCancel,
  pristine,
  submitting,
  values: formValues,
  form: { batch, change },
  invoice,
  vendorCode,
  accounts,
  adjustmentsPresets,
}) => {
  const history = useHistory();
  const accordionStatusRef = useRef();

  const changeAccountNumber = useCallback((accountNo) => {
    const accountingCode = get(find(accounts, { accountNo }), 'appSystemNo', '') || vendorCode;

    if (accountNo) {
      change('accountingCode', accountingCode);
      change('accountNumber', accountNo);
    } else {
      change('accountingCode', null);
      change('accountNumber', null);
    }
  }, [accounts, vendorCode]);

  const changeOrderLine = useCallback((orderLine) => {
    batch(() => {
      change('poLineId', orderLine?.id);

      if (orderLine) {
        const invoiceLineFields = convertToInvoiceLineFields(orderLine, {
          accounts,
          erpCode: vendorCode,
        });
        const fieldsToIgnore = initialValues.poLineId ? ['quantity', 'subTotal'] : [];

        Object
          .keys(invoiceLineFields)
          .filter(field => !fieldsToIgnore.includes(field))
          .forEach(field => {
            change(field, invoiceLineFields[field]);
          });
      }
    });
  }, [batch, change, accounts, vendorCode, initialValues.poLineId]);

  const {
    accountNumber,
    adjustments,
    id,
    invoiceLineNumber,
    invoiceLineStatus,
    metadata,
    poLineId,
    subTotal,
  } = initialValues;
  const totalAmount = calculateTotalAmount(formValues, invoice.currency);
  const isEditPostApproval = IS_EDIT_POST_APPROVAL(id, invoiceLineStatus);
  const isDisabledToEditAccountNumber = Boolean(
    isEditPostApproval
    || (poLineId && poLineId !== formValues.poLineId && accountNumber),
  );

  const shortcuts = [
    {
      name: 'cancel',
      shortcut: 'esc',
      handler: handleKeyCommand(onCancel),
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

  const paneTitle = id
    ? <FormattedMessage id="ui-invoice.invoiceLine.paneTitle.edit" values={{ invoiceLineNumber }} />
    : <FormattedMessage id="ui-invoice.invoiceLine.paneTitle.create" />;
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
  const accountNumbers = uniq(accounts.map(account => get(account, 'accountNo')).filter(Boolean));

  return (
    <form
      id="invoice-line-form"
      style={{ height: '100vh' }}
    >
      <HasCommand
        commands={shortcuts}
        isWithinScope={checkScope}
        scope={document.body}
      >
        <Paneset>
          <Pane
            defaultWidth="fill"
            dismissible
            footer={paneFooter}
            id="pane-invoice-line-form"
            onClose={onCancel}
            paneTitle={paneTitle}
          >
            <Row>
              <Col xs={12} md={8} mdOffset={2}>
                <AccordionStatus ref={accordionStatusRef}>
                  <Row end="xs">
                    <Col xs={12}>
                      <ExpandAllButton />
                    </Col>
                  </Row>
                  <AccordionSet>
                    <Accordion
                      id={SECTIONS.information}
                      label={<FormattedMessage id="ui-invoice.invoiceLineInformation" />}
                    >
                      {metadata && <ViewMetaData metadata={metadata} />}
                      <Row>
                        <Col data-test-col-invoice-line-description xs={12}>
                          <Field
                            component={TextField}
                            label={<FormattedMessage id="ui-invoice.invoiceLine.description" />}
                            id="description"
                            name="description"
                            required
                            type="text"
                            validate={validateRequired}
                          />
                        </Col>
                        <Col xs={3}>
                          <POLineField
                            onSelect={changeOrderLine}
                            isNonInteractive={isEditPostApproval}
                            poLineId={formValues.poLineId}
                          />
                        </Col>
                        <Col data-test-col-invoice-line-number xs={3}>
                          <KeyValue
                            label={<FormattedMessage id="ui-invoice.invoiceLine.invoiceLineNumber" />}
                            value={invoiceLineNumber}
                          />
                        </Col>
                        <Col data-test-col-invoice-line-status xs={3}>
                          <StatusValue value={invoiceLineStatus} />
                        </Col>
                        <Col data-test-col-invoice-line-vendor-ref-no xs={12}>
                          <VendorReferenceNumbersFields />
                        </Col>
                      </Row>

                      <Row>
                        <Col data-test-col-invoice-line-subscription-info xs={3}>
                          <Field
                            component={TextField}
                            label={<FormattedMessage id="ui-invoice.invoiceLine.subscriptionInfo" />}
                            id="subscriptionInfo"
                            name="subscriptionInfo"
                            isNonInteractive={isEditPostApproval}
                            type="text"
                          />
                        </Col>
                        <Col data-test-col-invoice-line-subscription-start xs={3}>
                          <FieldDatepickerFinal
                            labelId="ui-invoice.invoiceLine.subscriptionStart"
                            name="subscriptionStart"
                            isNonInteractive={isEditPostApproval}
                          />
                        </Col>
                        <Col data-test-col-invoice-line-subscription-end xs={3}>
                          <FieldDatepickerFinal
                            labelId="ui-invoice.invoiceLine.subscriptionEnd"
                            name="subscriptionEnd"
                            isNonInteractive={isEditPostApproval}
                          />
                        </Col>
                        <Col data-test-col-invoice-line-comment xs={3}>
                          <Field
                            component={TextField}
                            id="comment"
                            label={<FormattedMessage id="ui-invoice.invoiceLine.comment" />}
                            name="comment"
                          />
                        </Col>
                        <Col data-test-col-invoice-line-account-number xs={3}>
                          <KeyValue
                            label={<FormattedMessage id="ui-invoice.invoice.accountingCode" />}
                            value={formValues.accountingCode}
                          />
                        </Col>
                        <Col data-test-col-invoice-line-accounting-code xs={3}>
                          <FieldSelectionFinal
                            dataOptions={getAccountNumberOptions(accountNumbers)}
                            id="invoice-line-account-number"
                            labelId="ui-invoice.invoiceLine.accountNumber"
                            name="accountNumber"
                            onChange={changeAccountNumber}
                            isNonInteractive={isDisabledToEditAccountNumber}
                          />
                        </Col>
                        <Col data-test-col-invoice-line-quantity xs={3}>
                          <Field
                            component={TextField}
                            id="quantity"
                            isNonInteractive={isEditPostApproval}
                            label={<FormattedMessage id="ui-invoice.invoiceLine.quantity" />}
                            name="quantity"
                            required
                            type="number"
                            validate={validateRequired}
                          />
                        </Col>
                        <Col data-test-col-invoice-line-sub-total xs={3}>
                          {isEditPostApproval
                            ? (
                              <KeyValue label={<FormattedMessage id="ui-invoice.invoiceLine.subTotal" />}>
                                <AmountWithCurrencyField
                                  amount={subTotal}
                                  currency={invoice.currency}
                                />
                              </KeyValue>
                            )
                            : (
                              <Field
                                component={TextField}
                                id="subTotal"
                                label={<FormattedMessage id="ui-invoice.invoiceLine.subTotal" />}
                                name="subTotal"
                                required
                                type="number"
                                parse={parseNumberFieldValue}
                                validate={validateRequiredNumber}
                              />
                            )
                          }
                        </Col>
                        <Col data-test-col-release-encumbrance xs={3}>
                          <Field
                            component={Checkbox}
                            label={<FormattedMessage id="ui-invoice.invoiceLine.releaseEncumbrance" />}
                            name="releaseEncumbrance"
                            type="checkbox"
                          />
                        </Col>
                      </Row>
                    </Accordion>
                    <Accordion
                      id={SECTIONS.fundDistribution}
                      label={<FormattedMessage id="ui-invoice.fundDistribution" />}
                    >
                      <FundDistributionFieldsFinal
                        change={change}
                        currency={invoice.currency}
                        disabled={isEditPostApproval}
                        fundDistribution={formValues.fundDistributions}
                        name="fundDistributions"
                        totalAmount={totalAmount}
                      />
                    </Accordion>
                    <Accordion
                      id={SECTIONS.adjustments}
                      label={<FormattedMessage id="ui-invoice.adjustments" />}
                    >
                      <AdjustmentsForm
                        adjustmentsPresets={adjustmentsPresets}
                        change={change}
                        initialAdjustments={adjustments}
                        initialCurrency={invoice.currency}
                        isLineAdjustments
                        isNonInteractive={isEditPostApproval}
                      />
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

InvoiceLineForm.propTypes = {
  initialValues: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  values: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  invoice: PropTypes.object.isRequired,
  vendorCode: PropTypes.string,
  accounts: PropTypes.arrayOf(PropTypes.object),
  adjustmentsPresets: PropTypes.arrayOf(PropTypes.object),
};

InvoiceLineForm.defaultProps = {
  vendorCode: '',
  accounts: [],
};

export default stripesForm({
  subscription: { values: true },
  navigationCheck: true,
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
})(InvoiceLineForm);
