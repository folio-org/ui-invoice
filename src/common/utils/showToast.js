import React from 'react';
import { FormattedMessage } from 'react-intl';

// eslint-disable-next-line import/prefer-default-export
export function showToast(messageId, messageType = 'success', values = {}) {
  this.callout.current.sendCallout({
    message: <FormattedMessage id={messageId} values={values} />,
    type: messageType,
  });
}
