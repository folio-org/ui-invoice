import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import {
  Button,
  PaneFooter,
} from '@folio/stripes/components';

const BatchGroupConfigurationFormFooter = ({
  handleSubmit,
  pristine,
  submitting,
}) => {
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
      renderEnd={end}
    />
  );
};

BatchGroupConfigurationFormFooter.propTypes = {
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default BatchGroupConfigurationFormFooter;
