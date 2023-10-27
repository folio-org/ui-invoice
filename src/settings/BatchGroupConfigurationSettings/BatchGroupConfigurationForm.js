import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import { Field } from 'react-final-form';
import { OnChange } from 'react-final-form-listeners';
import { get, noop } from 'lodash';

import stripesFinalForm from '@folio/stripes/final-form';
import {
  Button,
  checkScope,
  Col,
  HasCommand,
  Pane,
  PaneHeader,
  Row,
  Timepicker,
} from '@folio/stripes/components';
import {
  IfPermission,
  useStripes,
} from '@folio/stripes/core';
import {
  FieldSelectFinal as FieldSelect,
  TextField,
  handleKeyCommand,
  usePaneFocus,
  validateRequired,
} from '@folio/stripes-acq-components';

import {
  CredentialsField,
  CredentialsFieldsGroup,
  CredentialsToggle,
} from '../../common/components';
import { hasEditSettingsPerm } from '../utils';
import BatchGroupConfigurationFormFooter from './BatchGroupConfigurationFormFooter';
import BatchGroupsField from './BatchGroupsField';
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
  const stripes = useStripes();
  const formValues = get(form.getState(), 'values', {});
  const scheduleExportWeekly = formValues.scheduleExport === SCHEDULE_EXPORT.weekly;
  const placeholder = formValues.ftpFormat || LOCATION_TYPES.FTP;
  const hasEditPerm = hasEditSettingsPerm(stripes);
  const hasEditCredentialsPerm = hasEditPerm && stripes.hasPerm('ui-invoice.batchVoucher.exportConfigs.credentials.edit');

  const paneFooter = (
    <BatchGroupConfigurationFormFooter
      handleSubmit={handleSubmit}
      pristine={pristine}
      submitting={submitting}
    />
  );

  const renderHeader = useCallback((paneHeaderProps) => (
    <PaneHeader
      {...paneHeaderProps}
      paneTitle={<FormattedMessage id="ui-invoice.settings.batchGroupConfiguration.label" />}
      paneTitleRef={paneTitleRef}
    />
  ), []);

  const shortcuts = [
    {
      name: 'save',
      handler: handleKeyCommand(hasEditPerm ? handleSubmit : noop, { disabled: pristine || submitting }),
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
        renderHeader={renderHeader}
        footer={hasEditPerm && paneFooter}
        id="pane-batch-group-configuration"
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
                  isNonInteractive={!hasEditPerm}
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
                    disabled={!hasEditPerm}
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
                  disabled={!hasEditPerm}
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
              isNonInteractive={!hasEditPerm}
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
              isNonInteractive={!hasEditPerm}
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
              isNonInteractive={!hasEditPerm}
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
              isNonInteractive={!hasEditPerm}
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
              isNonInteractive={!hasEditPerm}
              dataOptions={EXPORT_FORMAT_OPTIONS}
              label={<FormattedMessage id="ui-invoice.settings.batchGroupConfiguration.format" />}
              name="format"
              required
              validate={validateRequired}
            />
          </Col>
        </Row>

        <IfPermission perm="batch-voucher.export-configurations.credentials.item.get">
          <CredentialsFieldsGroup>
            <Row bottom="xs">
              <Col
                data-test-col-username
                xs={4}
              >
                <CredentialsField
                  id="username"
                  isNonInteractive={!hasEditCredentialsPerm}
                  label={<FormattedMessage id="ui-invoice.settings.batchGroupConfiguration.username" />}
                  name="username"
                  parse={v => v}
                  />
              </Col>
              <Col xs={4}>
                <CredentialsField
                  autoComplete="new-password"
                  id="password"
                  isNonInteractive={!hasEditCredentialsPerm}
                  label={<FormattedMessage id="ui-invoice.settings.batchGroupConfiguration.password" />}
                  name="password"
                />
              </Col>
              <Col xs={2}>
                <CredentialsToggle />
              </Col>
            </Row>
          </CredentialsFieldsGroup>
        </IfPermission>

        <IfPermission perm="batch-voucher.export-configurations.credentials.test">
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
        </IfPermission>
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
