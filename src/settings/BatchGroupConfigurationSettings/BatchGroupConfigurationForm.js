import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';
import { OnChange } from 'react-final-form-listeners';
import { get } from 'lodash';

import stripesFinalForm from '@folio/stripes/final-form';
import {
  Button,
  Col,
  ConfirmationModal,
  Pane,
  Row,
  TextField,
  Timepicker,
} from '@folio/stripes/components';
import {
  FieldSelectFinal as FieldSelect,
  useModalToggle,
  validateRequired,
} from '@folio/stripes-acq-components';

import BatchGroupConfigurationFormFooter from './BatchGroupConfigurationFormFooter';
import BatchGroupsField from './BatchGroupsField';
import TogglePassword from './TogglePassword';
import WeekdaysField from './WeekdaysField';
import { validateUploadURI } from './utils';
import {
  EXPORT_FORMAT_OPTIONS,
  SCHEDULE_EXPORT_OPTIONS,
  SCHEDULE_EXPORT,
  WEEKDAYS_OPTIONS,
} from './constants';
import { BatchVoucherExportsList } from './BatchVoucherExportsList';

const trimTime = value => value.slice(0, 5);

const BatchGroupConfigurationForm = ({
  batchGroups,
  batchVoucherExports,
  form,
  handleSubmit,
  hasCredsSaved,
  onNeedMoreData,
  pristine,
  recordsCount,
  runManualExport,
  selectBatchGroup,
  selectedBatchGroupId,
  submitting,
  testConnection,
}) => {
  const formValues = get(form.getState(), 'values', {});
  const scheduleExportWeekly = formValues.scheduleExport === SCHEDULE_EXPORT.weekly;
  const [isManualExportConfirmation, toggleManualExportConfirmation] = useModalToggle();
  const selectedBatchGroupName = batchGroups.find(({ id }) => id === selectedBatchGroupId)?.name;

  const onRunManualExport = useCallback(
    () => {
      toggleManualExportConfirmation();
      runManualExport();
    },
    [runManualExport, toggleManualExportConfirmation],
  );

  const paneFooter = (
    <BatchGroupConfigurationFormFooter
      exportConfigId={formValues.id}
      handleSubmit={handleSubmit}
      pristine={pristine}
      runManualExport={toggleManualExportConfirmation}
      submitting={submitting}
    />
  );

  return (
    <Pane
      data-test-batch-group-configuration-settings
      defaultWidth="fill"
      footer={paneFooter}
      id="pane-batch-group-configuration"
      paneTitle={<FormattedMessage id="ui-invoice.settings.batchGroupConfiguration.label" />}
    >
      <Row>
        <Col
          data-test-col-batch-group-field
          xs={4}
        >
          <BatchGroupsField
            batchGroups={batchGroups}
            selectBatchGroup={selectBatchGroup}
            selectedBatchGroupId={selectedBatchGroupId}
          />
        </Col>
      </Row>

      <Row>
        <Col
          data-test-col-schedule-export
          xs={4}
        >
          <FieldSelect
            dataOptions={SCHEDULE_EXPORT_OPTIONS}
            label={<FormattedMessage id="ui-invoice.settings.batchGroupConfiguration.scheduleExport" />}
            name="scheduleExport"
          />
          <OnChange name="scheduleExport">
            {form.mutators.setScheduledExport}
          </OnChange>
        </Col>
      </Row>

      {formValues.enableScheduledExport && (
        <>
          {scheduleExportWeekly && (
            <Row>
              <Col
                data-test-col-weekdays
                xs={12}
              >
                <WeekdaysField
                  name="weekdays"
                  weekdays={WEEKDAYS_OPTIONS}
                />
              </Col>
            </Row>
          )}

          <Row>
            <Col
              data-test-col-time
              xs={4}
            >
              <Field
                name="startTime"
                component={Timepicker}
                label={<FormattedMessage id="ui-invoice.settings.batchGroupConfiguration.setTime" />}
                parse={trimTime}
                required
                validate={validateRequired}
              />
            </Col>
          </Row>
        </>
      )}

      <Row>
        <Col
          data-test-col-upload-location
          xs={8}
        >
          <Field
            component={TextField}
            id="uploadURI"
            label={<FormattedMessage id="ui-invoice.settings.batchGroupConfiguration.uploadLocation" />}
            name="uploadURI"
            type="text"
            validate={validateUploadURI}
          />
        </Col>
        <Col
          data-test-col-format
          xs={4}
        >
          <FieldSelect
            dataOptions={EXPORT_FORMAT_OPTIONS}
            label={<FormattedMessage id="ui-invoice.settings.batchGroupConfiguration.format" />}
            name="format"
            required
            validate={validateRequired}
          />
        </Col>
      </Row>

      <Row bottom="xs">
        <Col
          data-test-col-username
          xs={4}
        >
          <Field
            id="username"
            label={<FormattedMessage id="ui-invoice.settings.batchGroupConfiguration.username" />}
            name="username"
            component={TextField}
            fullWidth
            parse={v => v}
          />
        </Col>

        <TogglePassword name="password" />
      </Row>

      <Row>
        <Col
          data-test-col-test-connection
          xs={4}
        >
          <Button
            buttonStyle="primary"
            bottomMargin0
            data-test-connection-test-button
            disabled={!(formValues.id && formValues.uploadURI && hasCredsSaved)}
            onClick={testConnection}
          >
            <FormattedMessage id="ui-invoice.settings.batchGroupConfiguration.testConnection" />
          </Button>
        </Col>
      </Row>
      <BatchVoucherExportsList
        batchVoucherExports={batchVoucherExports}
        format={formValues.format}
        onNeedMoreData={onNeedMoreData}
        recordsCount={recordsCount}
      />

      {isManualExportConfirmation && (
        <ConfirmationModal
          id="run-manual-export-confirmation"
          confirmLabel={<FormattedMessage id="ui-invoice.button.continue" />}
          heading={<FormattedMessage id="ui-invoice.settings.actions.manualExport.heading" />}
          message={
            <FormattedMessage
              id="ui-invoice.settings.actions.manualExport.message"
              values={{ selectedBatchGroupName }}
            />
          }
          onCancel={toggleManualExportConfirmation}
          onConfirm={onRunManualExport}
          open
        />
      )}
    </Pane>
  );
};

BatchGroupConfigurationForm.propTypes = {
  batchGroups: PropTypes.arrayOf(PropTypes.object),
  batchVoucherExports: PropTypes.arrayOf(PropTypes.object),
  form: PropTypes.object,
  handleSubmit: PropTypes.func.isRequired,
  hasCredsSaved: PropTypes.bool.isRequired,
  onNeedMoreData: PropTypes.func,
  pristine: PropTypes.bool,
  recordsCount: PropTypes.number,
  runManualExport: PropTypes.func.isRequired,
  selectBatchGroup: PropTypes.func.isRequired,
  selectedBatchGroupId: PropTypes.string,
  submitting: PropTypes.bool,
  testConnection: PropTypes.func.isRequired,
};

export default stripesFinalForm({
  subscription: { values: true },
  navigationCheck: true,
  mutators: {
    setScheduledExport: ([value], state, tools) => {
      if (!value) {
        tools.changeValue(state, 'enableScheduledExport', () => false);
        tools.changeValue(state, 'startTime', () => null);
        tools.changeValue(state, 'weekdays', () => {});
      } else if (value === SCHEDULE_EXPORT.daily) {
        tools.changeValue(state, 'enableScheduledExport', () => true);
        tools.changeValue(state, 'weekdays', () => {});
      } else {
        tools.changeValue(state, 'enableScheduledExport', () => true);
      }
    },
  },
})(BatchGroupConfigurationForm);
