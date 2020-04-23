import React from 'react';
import { FormattedMessage } from 'react-intl';

import { CONTENT_TYPES } from '../../common/constants';

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

export const RESULT_COUNT_INCREMENT = 10;

export const EXPORT_FORMATS_HEADER_MAP = {
  [EXPORT_FORMAT.json]: CONTENT_TYPES.json,
  [EXPORT_FORMAT.xml]: CONTENT_TYPES.xml,
};
