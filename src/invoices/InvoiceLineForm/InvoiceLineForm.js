import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import {
  Field,
  getFormValues,
} from 'redux-form';

import {
  find,
  get,
  uniq,
} from 'lodash';

import {
  Accordion,
  AccordionSet,
  Button,
  Checkbox,
  Col,
  ExpandAllButton,
  Pane,
  PaneMenu,
  Paneset,
  Row,
  TextField,
} from '@folio/stripes/components';
import { stripesShape } from '@folio/stripes/core';
import stripesForm from '@folio/stripes/form';
import { ViewMetaData } from '@folio/stripes/smart-components';
import {
  FieldDatepicker,
  FieldSelection,
  FundDistributionFields,
  parseNumberFieldValue,
} from '@folio/stripes-acq-components';

import {
  expandAll,
  IS_EDIT_POST_APPROVAL,
  toggleSection,
  validateRequired,
  getAccountNumberOptions,
  calculateTotalAmount,
} from '../../common/utils';
import AdjustmentsForm from '../AdjustmentsForm';
import { SECTIONS_INVOICE_LINE as SECTIONS } from '../constants';
import validate from './validate';

const INVOICE_LINE_FORM = 'invoiceLineForm';

const getLastMenu = (handleSubmit, pristine, submitting) => {
  return (
    <PaneMenu>
      <Button
        data-test-button-invoice-line-save
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

class InvoiceLineForm extends Component {
  static propTypes = {
    initialValues: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    stripes: stripesShape.isRequired,
    onCancel: PropTypes.func.isRequired,
    pristine: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired,
    change: PropTypes.func.isRequired,
    invoice: PropTypes.object.isRequired,
    vendorCode: PropTypes.string,
    accounts: PropTypes.arrayOf(PropTypes.object),
    adjustmentsPresets: PropTypes.arrayOf(PropTypes.object),
  }

  static defaultProps = {
    vendorCode: '',
    accounts: [],
  }

  constructor(props) {
    super(props);
    this.expandAll = expandAll.bind(this);
    this.toggleSection = toggleSection.bind(this);
  }

  state = {
    sections: {},
  }

  changeAccountNumber = (e, accountNo) => {
    const { dispatch, change, vendorCode, accounts } = this.props;
    const accountingCode = get(find(accounts, { accountNo }), 'appSystemNo', '') || vendorCode;

    if (accountNo) {
      dispatch(change('accountingCode', accountingCode));
    } else {
      dispatch(change('accountingCode', ''));
    }
  };

  render() {
    const {
      accounts,
      adjustmentsPresets,
      handleSubmit,
      initialValues,
      onCancel,
      pristine,
      submitting,
      stripes,
      invoice,
    } = this.props;
    const { sections } = this.state;
    const formValues = getFormValues(INVOICE_LINE_FORM)(stripes.store.getState());
    const invoiceLineNumber = get(initialValues, 'invoiceLineNumber', '');
    const { accountNumber, poLineId, metadata } = initialValues;
    const totalAmount = calculateTotalAmount(formValues);
    const isEditPostApproval = IS_EDIT_POST_APPROVAL(initialValues.id, initialValues.invoiceLineStatus);
    const isDisabledToEditAccountNumber = Boolean(isEditPostApproval || (poLineId && accountNumber));
    const isDisabledEditFundDistribution = IS_EDIT_POST_APPROVAL(invoice.id, invoice.status);

    const lastMenu = getLastMenu(handleSubmit, pristine, submitting);
    const paneTitle = initialValues.id
      ? <FormattedMessage id="ui-invoice.invoiceLine.paneTitle.edit" values={{ invoiceLineNumber }} />
      : <FormattedMessage id="ui-invoice.invoiceLine.paneTitle.create" />;
    const accountNumbers = uniq(accounts.map(account => get(account, 'accountNo')).filter(Boolean));
    const fundDistributions = get(formValues, 'fundDistributions');

    return (
      <form id="invoice-line-form">
        <Paneset>
          <Pane
            defaultWidth="fill"
            dismissible
            id="pane-invoice-line-form"
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
                    id={SECTIONS.invoiceLineInformation}
                    label={<FormattedMessage id="ui-invoice.invoiceLineInformation" />}
                  >
                    {metadata && <ViewMetaData metadata={metadata} />}
                    <Row>
                      <Col data-test-col-invoice-line-description xs={3}>
                        <Field
                          component={TextField}
                          label={<FormattedMessage id="ui-invoice.invoiceLine.description" />}
                          name="description"
                          required
                          type="text"
                          validate={validateRequired}
                        />
                      </Col>
                      <Col data-test-col-invoice-line-number xs={3}>
                        <Field
                          component={TextField}
                          label={<FormattedMessage id="ui-invoice.invoiceLine.invoiceLineNumber" />}
                          name="invoiceLineNumber"
                          disabled
                          required
                          type="text"
                        />
                      </Col>
                      <Col data-test-col-invoice-line-status xs={3}>
                        <Field
                          component={TextField}
                          label={<FormattedMessage id="ui-invoice.invoiceLine.invoiceLineStatus" />}
                          name="invoiceLineStatus"
                          disabled
                          required
                        />
                      </Col>
                      <Col data-test-col-invoice-line-po-line-id xs={3}>
                        <Field
                          component={TextField}
                          label={<FormattedMessage id="ui-invoice.invoiceLine.poLineId" />}
                          name="poLineId"
                          disabled
                          type="text"
                        />
                      </Col>
                      <Col data-test-col-invoice-line-subscription-info xs={3}>
                        <Field
                          component={TextField}
                          disabled={isEditPostApproval}
                          label={<FormattedMessage id="ui-invoice.invoiceLine.subscriptionInfo" />}
                          name="subscriptionInfo"
                        />
                      </Col>
                      <Col data-test-col-invoice-line-subscription-start xs={3}>
                        <FieldDatepicker
                          disabled={isEditPostApproval}
                          labelId="ui-invoice.invoiceLine.subscriptionStart"
                          name="subscriptionStart"
                        />
                      </Col>
                      <Col data-test-col-invoice-line-subscription-end xs={3}>
                        <FieldDatepicker
                          disabled={isEditPostApproval}
                          labelId="ui-invoice.invoiceLine.subscriptionEnd"
                          name="subscriptionEnd"
                        />
                      </Col>
                      <Col data-test-col-invoice-line-quantity xs={3}>
                        <Field
                          component={TextField}
                          disabled={isEditPostApproval}
                          label={<FormattedMessage id="ui-invoice.invoiceLine.quantity" />}
                          name="quantity"
                          required
                          type="number"
                          validate={validateRequired}
                        />
                      </Col>
                      <Col data-test-col-invoice-line-sub-total xs={3}>
                        <Field
                          component={TextField}
                          label={<FormattedMessage id="ui-invoice.invoiceLine.subTotal" />}
                          name="subTotal"
                          required
                          type="number"
                          parse={parseNumberFieldValue}
                          validate={validateRequired}
                        />
                      </Col>
                      <Col data-test-col-invoice-line-vendor-ref-no xs={3}>
                        <Field
                          component={TextField}
                          label={<FormattedMessage id="ui-invoice.invoiceLine.vendorRefNo" />}
                          name="vendorRefNo"
                        />
                      </Col>
                      <Col data-test-col-invoice-line-account-number xs={3}>
                        <Field
                          component={TextField}
                          label={<FormattedMessage id="ui-invoice.invoice.accountingCode" />}
                          name="accountingCode"
                          disabled
                        />
                      </Col>
                      <Col data-test-col-invoice-line-accounting-code xs={3}>
                        <FieldSelection
                          dataOptions={getAccountNumberOptions(accountNumbers)}
                          disabled={isDisabledToEditAccountNumber}
                          id="invoice-line-account-number"
                          labelId="ui-invoice.invoiceLine.accountNumber"
                          name="accountNumber"
                          onChange={this.changeAccountNumber}
                        />
                      </Col>
                      <Col data-test-col-invoice-line-comment xs={3}>
                        <Field
                          component={TextField}
                          label={<FormattedMessage id="ui-invoice.invoiceLine.comment" />}
                          name="comment"
                        />
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
                    <FundDistributionFields
                      disabled={isDisabledEditFundDistribution}
                      fundDistribution={fundDistributions}
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
                      isLineAdjustments
                      disabled={isEditPostApproval}
                    />
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
  form: INVOICE_LINE_FORM,
  navigationCheck: true,
  validate,
})(InvoiceLineForm);
