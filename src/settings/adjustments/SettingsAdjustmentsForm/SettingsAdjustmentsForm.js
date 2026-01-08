import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { Field } from 'react-final-form';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';

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
import stripesFinalForm from '@folio/stripes/final-form';
import { ViewMetaData } from '@folio/stripes/smart-components';
import {
  FieldSelectFinal,
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

const SettingsAdjustmentsForm = ({
  close,
  form,
  handleSubmit,
  metadata,
  pristine,
  submitting,
  title,
  values: formValues,
}) => {
  const intl = useIntl();

  const { change } = form;

  // TODO: should be removed when no-prorated supports included in
  const onProrateChange = e => {
    const value = e.target.value;

    if (
      value === ADJUSTMENT_PRORATE_VALUES.notProrated
      && formValues?.relationToTotal !== ADJUSTMENT_RELATION_TO_TOTAL_VALUES.inAdditionTo
    ) change('relationToTotal', ADJUSTMENT_RELATION_TO_TOTAL_VALUES.inAdditionTo);

    change('prorate', value);
  };

  const relationOptions = useMemo(() => {
    return ADJUSTMENT_RELATION_TO_TOTAL_OPTIONS
      .filter(({ value }) => (
        formValues?.prorate !== ADJUSTMENT_PRORATE_VALUES.notProrated
        || value === ADJUSTMENT_RELATION_TO_TOTAL_VALUES.inAdditionTo
      ))
      .sort((a, b) => {
        const translatedA = intl.formatMessage({ id: a.labelId });
        const translatedB = intl.formatMessage({ id: b.labelId });

        return translatedA.localeCompare(translatedB);
      });
  }, [intl, formValues?.prorate]);

  const adjustmentTypeOptions = useMemo(() => {
    return ADJUSTMENT_TYPE_OPTIONS.sort((a, b) => {
      const translatedA = intl.formatMessage({ id: a.labelId });
      const translatedB = intl.formatMessage({ id: b.labelId });

      return translatedA.localeCompare(translatedB);
    });
  }, [intl]);

  const adjustmentProrateOptions = useMemo(() => {
    return ADJUSTMENT_PRORATE_OPTIONS.sort((a, b) => {
      const translatedA = intl.formatMessage({ id: a.labelId });
      const translatedB = intl.formatMessage({ id: b.labelId });

      return translatedA.localeCompare(translatedB);
    });
  }, [intl]);

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
      label={<FormattedMessage id="stripes-components.saveAndClose" />}
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
                    <FieldSelectFinal
                      label={<FormattedMessage id="ui-invoice.settings.adjustments.type" />}
                      name="type"
                      dataOptions={adjustmentTypeOptions}
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
                      label={<FormattedMessage id="ui-invoice.settings.adjustments.value" />}
                      name="defaultAmount"
                      parse={Number}
                      format={Number}
                      type="number"
                    />
                  </Col>
                  <Col
                    data-test-prorate
                    xs={3}
                  >
                    <FieldSelectFinal
                      label={<FormattedMessage id="ui-invoice.settings.adjustments.prorate" />}
                      name="prorate"
                      dataOptions={adjustmentProrateOptions}
                      required
                      validate={validateRequired}
                      onChange={onProrateChange}
                    />
                  </Col>
                  <Col
                    data-test-relation-to-total
                    xs={3}
                  >
                    <FieldSelectFinal
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
};

SettingsAdjustmentsForm.propTypes = {
  close: PropTypes.func.isRequired,
  form: PropTypes.shape({
    change: PropTypes.func.isRequired,
  }).isRequired,
  handleSubmit: PropTypes.func.isRequired,
  metadata: PropTypes.shape({}),
  pristine: PropTypes.bool,
  submitting: PropTypes.bool,
  title: PropTypes.node,
  values: PropTypes.shape({
    alwaysShow: PropTypes.bool,
    amount: PropTypes.string,
    description: PropTypes.string,
    prorate: PropTypes.string,
    relationToTotal: PropTypes.string,
    type: PropTypes.string,
  }),
};

export default stripesFinalForm({
  enableReinitialize: true,
  navigationCheck: true,
  subscription: { values: true },
})(SettingsAdjustmentsForm);
