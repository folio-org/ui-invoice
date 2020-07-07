import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Pluggable } from '@folio/stripes/core';

const buttonLabel = <FormattedMessage id="ui-invoice.invoice.details.lines.add" />;

const AddInvoiceLinesAction = ({ addLines, isDisabled, validateSelectedRecords }) => {
  return (
    <Pluggable
      aria-haspopup="true"
      searchButtonStyle="default"
      searchLabel={buttonLabel}
      type="find-po-line"
      addLines={addLines}
      disabled={isDisabled}
      dataKey="find-po-line"
      validateSelectedRecords={validateSelectedRecords}
    >
      <FormattedMessage id="ui-invoice.find-po-line-plugin-unavailable" />
    </Pluggable>
  );
};

AddInvoiceLinesAction.propTypes = {
  addLines: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool,
  validateSelectedRecords: PropTypes.func.isRequired,
};

AddInvoiceLinesAction.defaultProps = {
  isDisabled: false,
};

export default AddInvoiceLinesAction;
