import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Button,
} from '@folio/stripes/components';
import { IfPermission } from '@folio/stripes/core';

const LineButtons = ({ createLine }) => (
  <IfPermission perm="invoice.invoice-lines.item.post">
    <Button
      data-test-button-create-line
      onClick={createLine}
    >
      <FormattedMessage id="ui-invoice.button.createLine" />
    </Button>
  </IfPermission>
);

LineButtons.propTypes = {
  createLine: PropTypes.func.isRequired,
};

export default LineButtons;
