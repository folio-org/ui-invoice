import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

import { Selection } from '@folio/stripes/components';

const TETHER_CONFIG = {
  attachment: 'middle center',
};

const EMPTY_OPTION = { label: '', value: null };

const FieldSelection = ({ dataOptions, labelId, ...rest }) => (
  <Field
    dataOptions={rest.required ? dataOptions : [EMPTY_OPTION, ...dataOptions]}
    disabled={rest.readOnly}
    fullWidth
    label={<FormattedMessage id={labelId} />}
    tether={TETHER_CONFIG}
    component={Selection}
    {...rest}
  />
);

FieldSelection.propTypes = {
  dataOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
  labelId: PropTypes.string,
  name: PropTypes.string.isRequired,
};

export default FieldSelection;
