import React from 'react';
import { FormattedMessage } from 'react-intl';
import {
  keys,
  pickBy,
} from 'lodash';
import { LOCATION_TYPES } from './constants';

const REGEXP_URI = {
  [LOCATION_TYPES.SFTP]: /^sftp:\/\/([^\s/?#]+)(?:[/?#]|$)/,
  [LOCATION_TYPES.FTP]: /^ftp:\/\/([^\s/?#]+)(?:[/?#]|$)/,
};

export const validateUploadURI = (value, fields) => {
  const ftpFormat = fields.ftpFormat || LOCATION_TYPES.FTP;
  const isValid = REGEXP_URI[ftpFormat].test(value);

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
    uploadDirectory: values.uploadDirectory,
    ftpFormat: values.ftpFormat,
    ftpPort: values.ftpPort,
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
