import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';

import {
  Checkbox,
  Label,
} from '@folio/stripes/components';

const WeekdaysField = ({ name, weekdays }) => {
  const WeekdaysGroup = ({ fields, options }) => (
    options.map((weekday, index) => (
      <Field
        key={index}
        component={Checkbox}
        label={weekday.label}
        name={`${fields.name}[${weekday.value}]`}
        type="checkbox"
        vertical
      />
    ))
  );

  return (
    <>
      <Label required>
        <FormattedMessage id="ui-invoice.settings.batchGroupConfiguration.on" />
      </Label>
      <FieldArray
        component={WeekdaysGroup}
        id="weekdays"
        name={name}
        options={weekdays}
      />
    </>
  );
};

WeekdaysField.propTypes = {
  name: PropTypes.string.isRequired,
  weekdays: PropTypes.arrayOf(PropTypes.object),
};

WeekdaysField.defaultProps = {
  weekdays: [],
};

export default WeekdaysField;
