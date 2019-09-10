import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Pluggable } from '@folio/stripes/core';

const buttonLabel = <FormattedMessage id="ui-invoice.invoice.details.lines.add" />;

const AddInvoiceLinesAction = ({ addLines }) => {
  return (
    <Pluggable
      aria-haspopup="true"
      searchButtonStyle="default"
      searchLabel={buttonLabel}
      type="find-po-line"
      addLines={addLines}
    >
      <FormattedMessage id="ui-invoice.find-po-line-plugin-unavailable" />
    </Pluggable>
  );
};

AddInvoiceLinesAction.propTypes = {
  addLines: PropTypes.func.isRequired,
};

export default AddInvoiceLinesAction;
