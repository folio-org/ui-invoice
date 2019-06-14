import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { Field } from 'redux-form';

import {
  Accordion,
  AccordionSet,
  Button,
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

const INVOICE_FORM = 'invoiceForm';
const SECTIONS = {
  invoiceInformation: 'invoiceInformation',
  extendedInformation: 'extendedInformation',
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
    pristine: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
    stripes: stripesShape,
  }

  constructor(props) {
    super(props);
    this.state = {
      sections: {
        [SECTIONS.invoiceInformation]: true,
      },
    };
    this.cViewMetaData = props.stripes.connect(ViewMetaData);
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
    const { initialValues, onCancel, handleSubmit, pristine, submitting } = this.props;
    const { sections } = this.state;
    const vendorInvoiceNo = get(initialValues, 'vendorInvoiceNo', '');
    const lastMenu = getLastMenu(handleSubmit, pristine, submitting);
    const paneTitle = initialValues.id
      ? <FormattedMessage id="ui-invoice.invoice.paneTitle.edit" values={{ vendorInvoiceNo }} />
      : <FormattedMessage id="ui-invoice.invoice.paneTitle.create" />;

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
                    {initialValues.metadata && <this.cViewMetaData metadata={initialValues.metadata} />}
                    <Row>
                      <Col xs={3}>
                        <Field
                          name="paymentTerms"
                          type="text"
                          component={TextField}
                          label={<FormattedMessage id="ui-invoice.invoice.paymentTerms" />}
                        />
                      </Col>
                      <Col xs={3}>
                        <Field
                          name="currency"
                          type="text"
                          component={TextField}
                          label={<FormattedMessage id="ui-invoice.invoice.currency" />}
                          readOnly
                          required
                        />
                      </Col>
                      <Col xs={3}>
                        <Field
                          name="approvedBy"
                          type="text"
                          component={TextField}
                          label={<FormattedMessage id="ui-invoice.invoice.approvedBy" />}
                          readOnly
                          required
                        />
                      </Col>
                    </Row>
                  </Accordion>
                  <Accordion
                    id={SECTIONS.extendedInformation}
                    label={<FormattedMessage id="ui-invoice.extendedInformation" />}
                  >
                    <Row>
                      <Col xs={3}>
                        <Field
                          name="folioInvoiceNo"
                          type="text"
                          component={TextField}
                          label={<FormattedMessage id="ui-invoice.invoice.folioInvoiceNo" />}
                          readOnly
                          required
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
