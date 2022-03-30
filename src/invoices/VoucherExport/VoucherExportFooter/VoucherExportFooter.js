import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import {
  Button,
  PaneFooter,
} from '@folio/stripes/components';

export const VoucherExportFooter = ({
  disabled,
  onCancel,
  runManualExport,
}) => {
  const start = (
    <Button
      buttonStyle="default mega"
      data-test-save-button
      onClick={onCancel}
    >
      <FormattedMessage id="ui-invoice.button.cancel" />
    </Button>
  );

  const end = (
    <Button
      buttonStyle="primary mega"
      disabled={disabled}
      onClick={runManualExport}
    >
      <FormattedMessage id="ui-invoice.button.runManualExport" />
    </Button>
  );

  return (
    <PaneFooter
      renderStart={start}
      renderEnd={end}
    />
  );
};

VoucherExportFooter.propTypes = {
  disabled: PropTypes.bool,
  onCancel: PropTypes.func.isRequired,
  runManualExport: PropTypes.func.isRequired,
};
