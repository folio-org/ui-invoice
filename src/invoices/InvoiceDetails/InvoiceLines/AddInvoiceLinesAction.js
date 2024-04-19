import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Pluggable } from '@folio/stripes/core';

const AddInvoiceLinesAction = ({ addLines, onClose, validateSelectedRecords }) => {
  return (
    <Pluggable
      aria-haspopup="true"
      type="find-po-line"
      addLines={addLines}
      onClose={onClose}
      trigerless
      dataKey="find-po-line"
      validateSelectedRecords={validateSelectedRecords}
    >
      <FormattedMessage id="ui-invoice.find-po-line-plugin-unavailable" />
    </Pluggable>
  );
};

AddInvoiceLinesAction.propTypes = {
  addLines: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  validateSelectedRecords: PropTypes.func.isRequired,
};

export default AddInvoiceLinesAction;
