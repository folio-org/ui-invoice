import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import {
  Button,
  PaneFooter,
} from '@folio/stripes/components';

const FormFooter = ({
  id,
  label,
  pristine,
  submitting,
  handleSubmit,
  onCancel,
}) => {
  const start = (
    <Button
      data-test-cancel-button
      buttonStyle="default mega"
      onClick={onCancel}
    >
      <FormattedMessage id="ui-invoice.cancel" />
    </Button>
  );

  const end = (
    <Button
      id={id}
      data-test-save-button
      type="submit"
      buttonStyle="primary mega"
      disabled={pristine || submitting}
      onClick={handleSubmit}
    >
      {label}
    </Button>
  );

  return (
    <PaneFooter
      renderStart={start}
      renderEnd={end}
    />
  );
};

FormFooter.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.node.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default FormFooter;
