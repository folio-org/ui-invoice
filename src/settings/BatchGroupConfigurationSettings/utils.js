import React from 'react';
import { FormattedMessage } from 'react-intl';
import {
  keys,
  pickBy,
} from 'lodash';

const REGEXP_URI = new RegExp('^$|([f][t][p])([s])?://.+$');

export const validateUploadURI = (value) => {
  const isValid = REGEXP_URI.test(value);

  if (value === undefined || isValid) return undefined;

  return <FormattedMessage id="ui-invoice.settings.batchGroupConfiguration.isUploadURIValid" />;
};

export const saveExportConfig = (
  { username, password, ...values },
  { exportConfig, credentials, exportConfigId },
  creds = {},
) => {
  const isNew = !values.id;
  const httpMethod = isNew ? 'POST' : 'PUT';
  const config = {
    id: values.id,
    batchGroupId: values.batchGroupId,
    startTime: values.startTime || null,
    weekdays: keys(pickBy(values.weekdays)),
    enableScheduledExport: values.enableScheduledExport,
    format: values.format,
    uploadURI: values.uploadURI,
  };

  return exportConfig[httpMethod](config)
    .then(({ id }) => {
      if ((!creds.id && (username || password)) || creds.username !== username || creds.password !== password) {
        exportConfigId.update({ id });
        credentials[creds.id ? 'PUT' : 'POST']({
          username,
          password,
          exportConfigId: isNew ? id : values.id,
        });
      }
    });
};
