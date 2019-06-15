import React from 'react';
import { FormattedMessage } from 'react-intl';

// eslint-disable-next-line import/prefer-default-export
export const validateRequired = (value) => {
  return value ? undefined : <FormattedMessage id="ui-invoice.validation.required" />;
};
