import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { Form, Field } from 'react-final-form';

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

const SECTIONS = {
  invoiceInformation: 'invoiceInformation',
};

const getLastMenu = (pristine, submitting) => {
  return (
    <PaneMenu>
      <Button
        data-test-button-save-invoice
        marginBottom0
        buttonStyle="primary"
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
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      sections: {
        [SECTIONS.invoiceInformation]: true,
      },
    };
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
    const { initialValues, onCancel, onSubmit } = this.props;
    const { sections } = this.state;
    const vendorInvoiceNo = get(initialValues, 'vendorInvoiceNo', '');
    const paneTitle = initialValues.id
      ? <FormattedMessage id="ui-invoice.invoice.paneTitle.edit" values={{ vendorInvoiceNo }} />
      : <FormattedMessage id="ui-invoice.invoice.paneTitle.create" />;

    return (
      <Form
        initialValues={initialValues}
        onSubmit={onSubmit}
        render={({ handleSubmit, pristine, form, submitting, values }) => {
          const lastMenu = getLastMenu(pristine, submitting);

          return (
            <form onSubmit={handleSubmit}>
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
                          <Row>
                            <Col xs={4}>
                              <Field
                                name="paymentTerms"
                                type="text"
                                component={TextField}
                                label={<FormattedMessage id="ui-invoice.invoice.paymentTerms" />}
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
        }}
      />
    );
  }
}

export default InvoiceForm;
