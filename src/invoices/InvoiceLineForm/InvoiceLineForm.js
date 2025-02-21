import find from 'lodash/find';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import {
  useCallback,
  useMemo,
  useRef,
} from 'react';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import { Field } from 'react-final-form';
import { useHistory } from 'react-router-dom';

import {
  Accordion,
  AccordionSet,
  AccordionStatus,
  Button,
  Checkbox,
  checkScope,
  Col,
  collapseAllSections,
  ExpandAllButton,
  expandAllSections,
  HasCommand,
  KeyValue,
  MessageBanner,
  Pane,
  PaneFooter,
  Paneset,
  Row,
} from '@folio/stripes/components';
import stripesForm from '@folio/stripes/final-form';
import { ViewMetaData } from '@folio/stripes/smart-components';
import {
  AmountWithCurrencyField,
  FieldDatepickerFinal,
  FieldSelectionFinal,
  FundDistributionFieldsFinal,
  handleKeyCommand,
  parseNumberFieldValue,
  TextField,
  validateRequired,
  validateRequiredNumber,
  VendorReferenceNumbersFields,
} from '@folio/stripes-acq-components';

import { StatusValue } from '../../common/components';
import {
  SUBMIT_ACTION,
  SUBMIT_ACTION_FIELD_NAME,
} from '../../common/constants';
import { useFundDistributionValidation } from '../../common/hooks';
import {
  calculateTotalAmount,
  IS_EDIT_POST_APPROVAL,
} from '../../common/utils';
import AdjustmentsForm from '../AdjustmentsForm';
import {
  ACCOUNT_STATUS,
  SECTIONS_INVOICE_LINE_FORM as SECTIONS,
} from '../constants';
import {
  convertToInvoiceLineFields,
  getActiveAccountNumberOptions,
} from '../utils';
import { POLineField } from './POLineField';

const DEFAULT_ACCOUNTS = [];

const InvoiceLineForm = ({
  accounts = DEFAULT_ACCOUNTS,
  adjustmentsPresets,
  form: { batch, change },
  handleSubmit,
  initialValues,
  invoice,
  isSubmitDisabled,
  onCancel,
  pristine,
  submitting,
  values: formValues,
  vendorCode = '',
}) => {
  const history = useHistory();
  const accordionStatusRef = useRef();
  const { formatMessage } = useIntl();
  const { validateFundDistributionTotal } = useFundDistributionValidation({
    formValues,
    currency: invoice.currency,
  });

  const changeAccountNumber = useCallback((accountNo) => {
    const accountingCode = get(find(accounts, { accountNo }), 'appSystemNo', '') || vendorCode;

    if (accountNo) {
      change('accountingCode', accountingCode);
      change('accountNumber', accountNo);
    } else {
      change('accountingCode', null);
      change('accountNumber', null);
    }
  }, [accounts, change, vendorCode]);

  const changeOrderLine = useCallback((orderLine) => {
    const fieldsToUpdate = initialValues.id && invoice.source === 'EDI'
      ? ['description', 'fundDistributions']
      : undefined;

    batch(() => {
      change('poLineId', orderLine?.id);

      if (orderLine) {
        const invoiceLineFields = convertToInvoiceLineFields(orderLine, {
          accounts,
          erpCode: vendorCode,
        });

        (fieldsToUpdate || Object.keys(invoiceLineFields))
          .forEach(field => {
            change(field, invoiceLineFields[field]);
          });
      }
    });
  }, [batch, change, accounts, vendorCode, invoice.source, initialValues.id]);

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
  const currentAccountNumber = formValues?.accountNumber;

  const onSaveAndClose = useCallback(() => {
    change(SUBMIT_ACTION_FIELD_NAME, SUBMIT_ACTION.saveAndClose);
    handleSubmit();
  }, [change, handleSubmit]);

  const onSaveAndKeepEditing = useCallback(() => {
    change(SUBMIT_ACTION_FIELD_NAME, SUBMIT_ACTION.saveAndKeepEditing);
    handleSubmit();
  }, [change, handleSubmit]);

  const shortcuts = [
    {
      name: 'cancel',
      shortcut: 'esc',
      handler: handleKeyCommand(onCancel),
    },
    {
      name: 'save',
      handler: handleKeyCommand(handleSubmit, { disabled: pristine || submitting || isSubmitDisabled }),
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

  const paneFooterStart = (
    <Row>
      <Col xs>
        <Button
          id="clickable-close-invoice-line-form"
          buttonStyle="default mega"
          onClick={onCancel}
        >
          <FormattedMessage id="stripes-components.cancel" />
        </Button>
      </Col>
    </Row>
  );

  const paneFooterEnd = (
    <Row>
      <Col xs>
        <Button
          id="clickable-save-and-keep-editing"
          buttonStyle="default mega"
          disabled={isSubmitDisabled}
          onClick={onSaveAndKeepEditing}
        >
          <FormattedMessage id="stripes-components.saveAndKeepEditing" />
        </Button>
      </Col>

      <Col xs>
        <Button
          id="clickable-save"
          buttonStyle="primary mega"
          disabled={isSubmitDisabled}
          onClick={onSaveAndClose}
        >
          <FormattedMessage id="stripes-components.saveAndClose" />
        </Button>
      </Col>
    </Row>
  );

  const paneFooter = (
    <PaneFooter
      renderStart={paneFooterStart}
      renderEnd={paneFooterEnd}
    />
  );

  const activeAccountOptions = useMemo(() => {
    return getActiveAccountNumberOptions({
      accounts,
      initialAccountNumber: accountNumber,
      formatMessage,
    });
  }, [accounts, accountNumber, formatMessage]);

  const isSelectedAccountInactive = useMemo(() => {
    return accounts.some(({ accountNo, accountStatus }) => {
      return accountNo === currentAccountNumber
        && accountStatus.toLowerCase() === ACCOUNT_STATUS.INACTIVE.toLowerCase();
    });
  }, [accounts, currentAccountNumber]);

  return (
    <HasCommand
      commands={shortcuts}
      isWithinScope={checkScope}
      scope={document.body}
    >
      <Paneset isRoot>
        <form
          id="invoice-line-form"
          style={{ height: '100vh' }}
        >
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
                  <AccordionSet id="invoice-line-form-accordion-set">
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
                            type="text"
                          />
                        </Col>
                        <Col data-test-col-invoice-line-subscription-start xs={3}>
                          <FieldDatepickerFinal
                            labelId="ui-invoice.invoiceLine.subscriptionStart"
                            name="subscriptionStart"
                          />
                        </Col>
                        <Col data-test-col-invoice-line-subscription-end xs={3}>
                          <FieldDatepickerFinal
                            labelId="ui-invoice.invoiceLine.subscriptionEnd"
                            name="subscriptionEnd"
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
                            dataOptions={activeAccountOptions}
                            id="invoice-line-account-number"
                            labelId="ui-invoice.invoiceLine.accountNumber"
                            name="accountNumber"
                            onChange={changeAccountNumber}
                            isNonInteractive={isDisabledToEditAccountNumber}
                          />
                          {
                            isSelectedAccountInactive && (
                              <MessageBanner type="warning">
                                <FormattedMessage id="ui-invoice.invoiceLine.accountNumber.inactive" />
                              </MessageBanner>
                            )
                          }
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
                        fiscalYearId={invoice.fiscalYearId}
                        validateFundDistributionTotal={validateFundDistributionTotal}
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
                        fiscalYearId={invoice.fiscalYearId}
                      />
                    </Accordion>
                  </AccordionSet>
                </AccordionStatus>
              </Col>
            </Row>
          </Pane>
        </form>
      </Paneset>
    </HasCommand>
  );
};

InvoiceLineForm.propTypes = {
  accounts: PropTypes.arrayOf(PropTypes.object),
  adjustmentsPresets: PropTypes.arrayOf(PropTypes.object),
  fiscalYearId: PropTypes.string,
  form: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired,
  invoice: PropTypes.object.isRequired,
  isSubmitDisabled: PropTypes.bool,
  onCancel: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  values: PropTypes.object.isRequired,
  vendorCode: PropTypes.string,
};

export default stripesForm({
  subscription: { values: true },
  navigationCheck: true,
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
})(InvoiceLineForm);
