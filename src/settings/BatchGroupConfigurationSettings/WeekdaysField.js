import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import { FormattedMessage } from 'react-intl';

import {
  Checkbox,
  Label,
} from '@folio/stripes/components';

const DEFAULT_WEEKDAYS = [];

const WeekdaysField = ({
  disabled = false,
  name,
  weekdays = DEFAULT_WEEKDAYS,
}) => {
  const WeekdaysGroup = ({ fields, options }) => (
    options.map((weekday, index) => (
      <Field
        key={index}
        disabled={disabled}
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
  disabled: PropTypes.bool,
  name: PropTypes.string.isRequired,
  weekdays: PropTypes.arrayOf(PropTypes.object),
};

export default WeekdaysField;
