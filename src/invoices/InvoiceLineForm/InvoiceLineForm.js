import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import {
  Field,
} from 'redux-form';

import {
  Button,
  Col,
  Pane,
  PaneMenu,
  Paneset,
  Row,
  TextField,
} from '@folio/stripes/components';
import stripesForm from '@folio/stripes/form';

import {
  validateRequired,
} from '../../common/utils';

const INVOICE_LINE_FORM = 'invoiceLneForm';

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

  render() {
    const { initialValues, onCancel, handleSubmit, pristine, submitting } = this.props;
    const invoiceLineNumber = get(initialValues, 'invoiceLineNumber', '');
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
                <Field
                  component={TextField}
                  label={<FormattedMessage id="ui-invoice.invoiceLine.description" />}
                  name="description"
                  required
                  type="text"
                  validate={validateRequired}
                />
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
