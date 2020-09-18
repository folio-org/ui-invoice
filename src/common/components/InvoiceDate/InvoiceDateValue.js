import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { KeyValue } from '@folio/stripes/components';
import { FolioFormattedDate } from '@folio/stripes-acq-components';

const InvoiceDateValue = ({ value }) => (
  <KeyValue
    label={<FormattedMessage id="ui-invoice.invoice.details.information.invoiceDate" />}
    value={<FolioFormattedDate value={value} />}
  />
);

InvoiceDateValue.propTypes = {
  value: PropTypes.string.isRequired,
};

export default InvoiceDateValue;
