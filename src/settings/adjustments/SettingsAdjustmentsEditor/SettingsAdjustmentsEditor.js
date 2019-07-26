import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'redux-form';

import { FieldSelect } from '@folio/stripes-acq-components';
import {
  Button,
  Checkbox,
  Col,
  Layer,
  Pane,
  PaneMenu,
  Row,
  TextField,
} from '@folio/stripes/components';
import stripesForm from '@folio/stripes/form';
import { ViewMetaData } from '@folio/stripes/smart-components';

import {
  ADJUSTMENT_PRORATE_OPTIONS,
  ADJUSTMENT_RELATION_TO_TOTAL_OPTIONS,
  ADJUSTMENT_TYPE_OPTIONS,
} from '../../../common/constants';
import { validateRequired } from '../../../common/utils';

class SettingsAdjustmentsEditor extends Component {
  static propTypes = {
    close: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    pristine: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
    title: PropTypes.node,
    metadata: PropTypes.object,
  };

  getLastMenu() {
    const { pristine, submitting } = this.props;

    return (
      <PaneMenu>
        <FormattedMessage id="ui-invoice.save">
          {ariaLabel => (
            <Button
              id="save-adjustment-button"
              type="submit"
              disabled={pristine || submitting}
              style={{ marginBottom: '0', marginRight: '10px' }}
            >
              {ariaLabel}
            </Button>
          )}
        </FormattedMessage>

      </PaneMenu>
    );
  }

  render() {
    const {
      handleSubmit,
      close,
      title,
      metadata,
    } = this.props;

    return (
      <Layer
        contentLabel="Adjustments editor"
        isOpen
      >
        <form
          id="settings-adjustments-form"
          onSubmit={handleSubmit}
        >
          <Pane
            id="settings-adjustments-editor"
            defaultWidth="fill"
            paneTitle={title}
            dismissible
            onClose={close}
            lastMenu={this.getLastMenu()}
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
                    />
                  </Col>
                  <Col
                    data-test-relation-to-total
                    xs={3}
                  >
                    <FieldSelect
                      label={<FormattedMessage id="ui-invoice.settings.adjustments.relationToTotal" />}
                      name="relationToTotal"
                      dataOptions={ADJUSTMENT_RELATION_TO_TOTAL_OPTIONS}
                      required
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
          </Pane>
        </form>
      </Layer>
    );
  }
}

export default stripesForm({
  enableReinitialize: true,
  form: 'SettingsAdjustmentsForm',
  navigationCheck: true,
})(SettingsAdjustmentsEditor);
