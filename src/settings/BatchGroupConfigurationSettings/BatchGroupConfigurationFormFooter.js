import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import {
  Button,
  PaneFooter,
} from '@folio/stripes/components';

const BatchGroupConfigurationFormFooter = ({
  exportConfigId,
  handleSubmit,
  pristine,
  runManualExport,
  submitting,
}) => {
  const start = (
    <Button
      buttonStyle="default mega"
      data-test-run-manual-export-button
      disabled={!exportConfigId}
      onClick={runManualExport}
    >
      <FormattedMessage id="ui-invoice.button.runManualExport" />
    </Button>
  );

  const end = (
    <Button
      buttonStyle="primary mega"
      data-test-save-button
      disabled={pristine || submitting}
      onClick={handleSubmit}
      type="submit"
    >
      <FormattedMessage id="ui-invoice.button.save" />
    </Button>
  );

  return (
    <PaneFooter
      renderStart={start}
      renderEnd={end}
    />
  );
};

BatchGroupConfigurationFormFooter.propTypes = {
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  runManualExport: PropTypes.func.isRequired,
  exportConfigId: PropTypes.string,
};

export default BatchGroupConfigurationFormFooter;
