import React from 'react';
import { FormattedMessage } from 'react-intl';

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const WEEKDAYS_OPTIONS = Object.values(WEEKDAYS).map(day => ({
  label: <FormattedMessage id={`ui-invoice.settings.batchGroupConfiguration.weekdays.${day}`} />,
  value: day,
}));

export const EXPORT_FORMAT = {
  json: 'Application/json',
  xml: 'Application/xml',
};

export const EXPORT_FORMAT_OPTIONS = Object.values(EXPORT_FORMAT).map(format => ({
  labelId: `ui-invoice.settings.batchGroupConfiguration.format.${format}`,
  value: format,
}));

export const SCHEDULE_EXPORT = {
  daily: 'daily',
  weekly: 'weekly',
};

export const SCHEDULE_EXPORT_OPTIONS = Object.values(SCHEDULE_EXPORT).map(schedule => ({
  labelId: `ui-invoice.settings.batchGroupConfiguration.scheduleExport.${schedule}`,
  value: schedule,
}));