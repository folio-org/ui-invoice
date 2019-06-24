import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import {
  Field,
  FieldArray,
} from 'redux-form';

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
  RepeatableField,
  Row,
  TextField,
} from '@folio/stripes/components';
import stripesForm from '@folio/stripes/form';
import { ViewMetaData } from '@folio/stripes/smart-components';

import {
  FieldSelection,
} from '../../common/components';
import {
  toggleSection,
  validateRequired,
} from '../../common/utils';
import AdjustmentsForm from '../AdjustmentsForm';

const INVOICE_LINE_FORM = 'invoiceLneForm';
const SECTIONS = {
  invoiceLineInformation: 'invoiceLineInformation',
  fundDistribution: 'fundDistribution',
  adjustments: 'adjustments',
};

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
    onCancel: PropTypes.func.isRequired,
    pristine: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
  }

  constructor(props) {
    super(props);
    this.toggleSection = toggleSection.bind(this);
  }

  state = {
    sections: {},
  }

  expandAll = (sections) => this.setState({ sections });

  render() {
    const { initialValues, onCancel, handleSubmit, pristine, submitting } = this.props;
    const { sections } = this.state;
    const invoiceLineNumber = get(initialValues, 'invoiceLineNumber', '');
    const metadata = initialValues.metadata;

    const lastMenu = getLastMenu(handleSubmit, pristine, submitting);
    const paneTitle = initialValues.id
      ? <FormattedMessage id="ui-invoice.invoiceLine.paneTitle.edit" values={{ invoiceLineNumber }} />
      : <FormattedMessage id="ui-invoice.invoiceLine.paneTitle.create" />;

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
                          readOnly
                          required
                          type="text"
                        />
                      </Col>
                      <Col data-test-col-invoice-line-status xs={3}>
                        <Field
                          component={TextField}
                          label={<FormattedMessage id="ui-invoice.invoiceLine.invoiceLineStatus" />}
                          name="invoiceLineStatus"
                          readOnly
                          required
                        />
                      </Col>
                      <Col data-test-col-invoice-line-po-line-id xs={3}>
                        <Field
                          component={TextField}
                          label={<FormattedMessage id="ui-invoice.invoiceLine.poLineId" />}
                          name="poLineId"
                          readOnly
                          type="text"
                        />
                      </Col>
                      <Col data-test-col-invoice-line-subscription-info xs={3}>
                        <Field
                          component={TextField}
                          label={<FormattedMessage id="ui-invoice.invoiceLine.subscriptionInfo" />}
                          name="subscriptionInfo"
                          readOnly
                        />
                      </Col>
                      <Col data-test-col-invoice-line-subscription-start xs={3}>
                        <Field
                          component={TextField}
                          label={<FormattedMessage id="ui-invoice.invoiceLine.subscriptionStart" />}
                          name="subscriptionStart"
                          readOnly
                        />
                      </Col>
                      <Col data-test-col-invoice-line-subscription-end xs={3}>
                        <Field
                          component={TextField}
                          label={<FormattedMessage id="ui-invoice.invoiceLine.subscriptionEnd" />}
                          name="subscriptionEnd"
                          readOnly
                        />
                      </Col>
                      <Col data-test-col-invoice-line-quantity xs={3}>
                        <Field
                          component={TextField}
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
                          validate={validateRequired}
                        />
                      </Col>
                      <Col data-test-col-invoice-line-vendor-ref-no xs={3}>
                        <Field
                          component={TextField}
                          label={<FormattedMessage id="ui-invoice.invoiceLine.vendorRefNo" />}
                          name="vendorRefNo"
                          readOnly
                        />
                      </Col>
                      <Col data-test-col-invoice-line-account-number xs={3}>
                        <FieldSelection
                          dataOptions={[]}
                          labelId="ui-invoice.invoiceLine.accountNumber"
                          name="accountNumber"
                          readOnly
                        />
                      </Col>
                      <Col data-test-col-invoice-line-accounting-code xs={3}>
                        <Field
                          component={TextField}
                          label={<FormattedMessage id="ui-invoice.invoiceLine.accountingCode" />}
                          name="accountingCode"
                          readOnly
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
                  />
                  <Accordion
                    id={SECTIONS.adjustments}
                    label={<FormattedMessage id="ui-invoice.adjustments" />}
                  >
                    <AdjustmentsForm />
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
})(InvoiceLineForm);
