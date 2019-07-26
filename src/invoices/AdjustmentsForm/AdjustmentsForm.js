import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import {
  Field,
  FieldArray,
} from 'redux-form';
import PropTypes from 'prop-types';
import { find } from 'lodash';

import {
  Col,
  Row,
  RepeatableField,
  TextField,
  Selection,
} from '@folio/stripes/components';
import { FieldSelect } from '@folio/stripes-acq-components';

import {
  ADJUSTMENT_PRORATE_OPTIONS,
  ADJUSTMENT_RELATION_TO_TOTAL_OPTIONS,
} from '../../common/constants';
import {
  getAdjustmentPresetOptions,
  validateRequired,
} from '../../common/utils';

const Adjustment = (elem) => {
  return (
    <Row>
      <Col xs>
        <Field
          component={TextField}
          fullWidth
          label={<FormattedMessage id="ui-invoice.adjustment.description" />}
          name={`${elem}.description`}
          required
          validate={validateRequired}
        />
      </Col>
      <Col xs>
        <Field
          component={TextField}
          fullWidth
          label={<FormattedMessage id="ui-invoice.adjustment.amount" />}
          name={`${elem}.value`}
          required
          type="number"
          validate={validateRequired}
        />
      </Col>
      <Col xs>
        <FieldSelect
          label={<FormattedMessage id="ui-invoice.settings.adjustments.prorate" />}
          name={`${elem}.prorate`}
          dataOptions={ADJUSTMENT_PRORATE_OPTIONS}
          required
          validate={validateRequired}
        />
      </Col>
      <Col xs>
        <FieldSelect
          label={<FormattedMessage id="ui-invoice.settings.adjustments.relationToTotal" />}
          name={`${elem}.relationToTotal`}
          dataOptions={ADJUSTMENT_RELATION_TO_TOTAL_OPTIONS}
          required
          validate={validateRequired}
        />
      </Col>
    </Row>
  );
};

const getAdjustmentFromPreset = ({ description, prorate, relationToTotal, type, defaultAmount }) => ({
  description,
  prorate,
  relationToTotal,
  type,
  value: defaultAmount,
});

const AdjustmentsForm = ({ adjustmentsPresets }) => {
  const [adjPreset, setAdjPreset] = useState();
  const onAdd = (fields) => {
    const newAdjustment = adjPreset
      ? getAdjustmentFromPreset(adjPreset.adjustment)
      : {};

    fields.push(newAdjustment);
  };

  return (
    <Row>
      <Col xs={12}>
        <Selection
          dataOptions={getAdjustmentPresetOptions(adjustmentsPresets)}
          label={<FormattedMessage id="ui-invoice.adjustment.presetAdjustment" />}
          onChange={(id) => setAdjPreset(find(adjustmentsPresets, { id }))}
        />
      </Col>
      <Col xs={12}>
        <FieldArray
          addLabel={<FormattedMessage id="ui-invoice.button.addAdjustment" />}
          component={RepeatableField}
          name="adjustments"
          renderField={Adjustment}
          onAdd={onAdd}
        />
      </Col>
    </Row>
  );
};

AdjustmentsForm.propTypes = {
  adjustmentsPresets: PropTypes.arrayOf(PropTypes.object),
};

AdjustmentsForm.defaultProps = {
  adjustmentsPresets: [],
};

export default AdjustmentsForm;
