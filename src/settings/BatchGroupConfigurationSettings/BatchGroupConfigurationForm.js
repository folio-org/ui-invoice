import React from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import { Field } from 'react-final-form';
import { OnChange } from 'react-final-form-listeners';
import { get } from 'lodash';

import stripesFinalForm from '@folio/stripes/final-form';
import {
  Button,
  checkScope,
  Col,
  HasCommand,
  Pane,
  Row,
  TextField,
  Timepicker,
} from '@folio/stripes/components';
import {
  FieldSelectFinal as FieldSelect,
  handleKeyCommand,
  usePaneFocus,
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
  LOCATION_TYPE_OPTIONS,
  SHOW_SCHEDULED_EXPORT,
  LOCATION_TYPES,
} from './constants';

const trimTime = value => value.slice(0, 5);

const BatchGroupConfigurationForm = ({
  batchGroups,
  form,
  handleSubmit,
  hasCredsSaved,
  pristine,
  selectBatchGroup,
  selectedBatchGroupId,
  submitting,
  testConnection,
}) => {
  const { paneTitleRef } = usePaneFocus();
  const intl = useIntl();
  const formValues = get(form.getState(), 'values', {});
  const scheduleExportWeekly = formValues.scheduleExport === SCHEDULE_EXPORT.weekly;
  const placeholder = formValues.ftpFormat || LOCATION_TYPES.FTP;

  const paneFooter = (
    <BatchGroupConfigurationFormFooter
      handleSubmit={handleSubmit}
      pristine={pristine}
      submitting={submitting}
    />
  );

  const shortcuts = [
    {
      name: 'save',
      handler: handleKeyCommand(handleSubmit, { disabled: pristine || submitting }),
    },
  ];

  return (
    <HasCommand
      commands={shortcuts}
      isWithinScope={checkScope}
      scope={document.body}
    >
      <Pane
        data-test-batch-group-configuration-settings
        defaultWidth="fill"
        footer={paneFooter}
        id="pane-batch-group-configuration"
        paneTitle={<FormattedMessage id="ui-invoice.settings.batchGroupConfiguration.label" />}
        paneTitleRef={paneTitleRef}
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
        {
          SHOW_SCHEDULED_EXPORT && (
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
          )
        }

        {(SHOW_SCHEDULED_EXPORT && formValues.enableScheduledExport) && (
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
            data-test-col-location-type
            xs={4}
          >
            <FieldSelect
              dataOptions={LOCATION_TYPE_OPTIONS}
              label={<FormattedMessage id="ui-invoice.settings.batchGroupConfiguration.locationType" />}
              name="ftpFormat"
              id="ftpFormat"
              required
            />
          </Col>
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
              placeholder={intl.formatMessage({ id: `ui-invoice.settings.batchGroupConfiguration.uploadLocation.placeholder.${placeholder}` })}
            />
          </Col>
        </Row>
        <Row>
          <Col
            data-test-col-port
            xs={4}
          >
            <Field
              id="ftpPort"
              label={<FormattedMessage id="ui-invoice.settings.batchGroupConfiguration.port" />}
              name="ftpPort"
              component={TextField}
              fullWidth
              type="number"
            />
          </Col>
          <Col
            data-test-col-directory
            xs={4}
          >
            <Field
              id="uploadDirectory"
              label={<FormattedMessage id="ui-invoice.settings.batchGroupConfiguration.directory" />}
              name="uploadDirectory"
              component={TextField}
              fullWidth
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
      </Pane>
    </HasCommand>
  );
};

BatchGroupConfigurationForm.propTypes = {
  batchGroups: PropTypes.arrayOf(PropTypes.object),
  form: PropTypes.object,
  handleSubmit: PropTypes.func.isRequired,
  hasCredsSaved: PropTypes.bool.isRequired,
  pristine: PropTypes.bool,
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
