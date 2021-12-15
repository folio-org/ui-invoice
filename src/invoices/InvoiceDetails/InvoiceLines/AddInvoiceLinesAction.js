import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Pluggable } from '@folio/stripes/core';
import { Icon } from '@folio/stripes/components';

const buttonLabel = (
  <Icon size="small" icon="plus-sign">
    <FormattedMessage id="ui-invoice.invoice.details.lines.addFromPOL" />
  </Icon>
);

const AddInvoiceLinesAction = ({ addLines, isDisabled, validateSelectedRecords }) => {
  return (
    <Pluggable
      aria-haspopup="true"
      searchButtonStyle="dropdownItem"
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
