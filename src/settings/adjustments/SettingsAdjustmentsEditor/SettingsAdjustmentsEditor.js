import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'redux-form';

import {
  Checkbox,
  checkScope,
  Col,
  HasCommand,
  Layer,
  Pane,
  Row,
  TextField,
} from '@folio/stripes/components';
import stripesForm from '@folio/stripes/form';
import { ViewMetaData } from '@folio/stripes/smart-components';
import {
  FieldSelect,
  FormFooter,
  handleKeyCommand,
  validateRequired,
} from '@folio/stripes-acq-components';

import {
  ADJUSTMENT_PRORATE_OPTIONS,
  ADJUSTMENT_PRORATE_VALUES,
  ADJUSTMENT_RELATION_TO_TOTAL_OPTIONS,
  ADJUSTMENT_RELATION_TO_TOTAL_VALUES,
  ADJUSTMENT_TYPE_OPTIONS,
} from '../../../common/constants';

class SettingsAdjustmentsEditor extends Component {
  static propTypes = {
    close: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    pristine: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
    title: PropTypes.node,
    metadata: PropTypes.object,
    change: PropTypes.func,
    formValues: PropTypes.object,
  };

  render() {
    const {
      handleSubmit,
      close,
      title,
      metadata,
      pristine,
      submitting,
      change,
      formValues,
    } = this.props;

    // TODO: should be removed when no-prorated supports included in
    const onProrateChange = e => {
      const value = e.target.value;

      if (
        value === ADJUSTMENT_PRORATE_VALUES.notProrated
        && formValues?.relationToTotal === ADJUSTMENT_RELATION_TO_TOTAL_VALUES.includedIn
      ) change('relationToTotal', '');

      change('prorate', value);
    };
    const relationOptions = ADJUSTMENT_RELATION_TO_TOTAL_OPTIONS.filter(({ value }) => (
      formValues?.prorate !== ADJUSTMENT_PRORATE_VALUES.notProrated
      || value !== ADJUSTMENT_RELATION_TO_TOTAL_VALUES.includedIn
    ));
    const shortcuts = [
      {
        name: 'cancel',
        shortcut: 'esc',
        handler: handleKeyCommand(close),
      },
      {
        name: 'save',
        handler: handleKeyCommand(handleSubmit, { disabled: pristine || submitting }),
      },
    ];

    const formFooter = (
      <FormFooter
        id="save-adjustment-button"
        label={<FormattedMessage id="ui-invoice.saveAndClose" />}
        pristine={pristine}
        submitting={submitting}
        handleSubmit={handleSubmit}
        onCancel={close}
      />
    );

    return (
      <Layer
        contentLabel="Adjustments editor"
        isOpen
      >
        <HasCommand
          commands={shortcuts}
          isWithinScope={checkScope}
          scope={document.body}
        >
          <form
            id="settings-adjustments-form"
            style={{ height: '100vh' }}
          >
            <Pane
              id="settings-adjustments-editor"
              defaultWidth="fill"
              paneTitle={title}
              dismissible
              onClose={close}
              footer={formFooter}
            >
              <Row center="xs">
                <Col xs={12} md={8}>
                  <Row start="xs">
                    <Col xs={12}>
                      {metadata && <ViewMetaData metadata={metadata} />}
                    </Col>
                    <Col
                      data-test-description
                      xs={3}
                    >
                      <Field
                        component={TextField}
                        label={<FormattedMessage id="ui-invoice.settings.adjustments.description" />}
                        name="description"
                        required
                        validate={validateRequired}
                      />
                    </Col>
                    <Col
                      data-test-type
                      xs={3}
                    >
                      <FieldSelect
                        label={<FormattedMessage id="ui-invoice.settings.adjustments.type" />}
                        name="type"
                        dataOptions={ADJUSTMENT_TYPE_OPTIONS}
                        required
                        validate={validateRequired}
                      />
                    </Col>
                    <Col
                      data-test-always-show
                      xs={3}
                    >
                      <Field
                        component={Checkbox}
                        label={<FormattedMessage id="ui-invoice.settings.adjustments.alwaysShow" />}
                        name="alwaysShow"
                        type="checkbox"
                        vertical
                      />
                    </Col>
                    <Col
                      data-test-default-amount
                      xs={3}
                    >
                      <Field
                        component={TextField}
                        label={<FormattedMessage id="ui-invoice.settings.adjustments.defaultAmount" />}
                        name="defaultAmount"
                        type="number"
                      />
                    </Col>
                    <Col
                      data-test-prorate
                      xs={3}
                    >
                      <FieldSelect
                        label={<FormattedMessage id="ui-invoice.settings.adjustments.prorate" />}
                        name="prorate"
                        dataOptions={ADJUSTMENT_PRORATE_OPTIONS}
                        required
                        validate={validateRequired}
                        onChange={onProrateChange}
                      />
                    </Col>
                    <Col
                      data-test-relation-to-total
                      xs={3}
                    >
                      <FieldSelect
                        label={<FormattedMessage id="ui-invoice.settings.adjustments.relationToTotal" />}
                        name="relationToTotal"
                        dataOptions={relationOptions}
                        required
                        validate={validateRequired}
                      />
                    </Col>
                    <Col
                      data-test-export-to-accounting
                      xs={3}
                    >
                      <Field
                        component={Checkbox}
                        label={<FormattedMessage id="ui-invoice.settings.adjustments.exportToAccounting" />}
                        name="exportToAccounting"
                        type="checkbox"
                        vertical
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Pane>
          </form>
        </HasCommand>
      </Layer>
    );
  }
}

export default stripesForm({
  enableReinitialize: true,
  form: 'SettingsAdjustmentsForm',
  navigationCheck: true,
})(SettingsAdjustmentsEditor);
