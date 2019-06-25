import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Pluggable,
  withStripes,
} from '@folio/stripes/core';

const buttonLabel = <FormattedMessage id="ui-invoice.invoice.details.lines.add" />;

const AddInvoiceLinesAction = ({ addLines, stripes }) => {
  return (
    <Pluggable
      aria-haspopup="true"
      dataKey="invoiceLines"
      searchButtonStyle="default"
      searchLabel={buttonLabel}
      stripes={stripes}
      type="find-po-line"
      addLines={addLines}
    >
      <FormattedMessage id="ui-invoice.find-po-line-plugin-unavailable" />
    </Pluggable>
  );
};

AddInvoiceLinesAction.propTypes = {
  addLines: PropTypes.func.isRequired,
  stripes: PropTypes.object.isRequired,
};

export default withStripes(AddInvoiceLinesAction);
