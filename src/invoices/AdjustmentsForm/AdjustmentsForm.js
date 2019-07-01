import React from 'react';
import { FormattedMessage } from 'react-intl';
import {
  Field,
  FieldArray,
} from 'redux-form';

import {
  Col,
  Row,
  RepeatableField,
  TextField,
} from '@folio/stripes/components';

import {
  validateRequired,
} from '../../common/utils';

const Adjustment = (elem) => {
  return (
    <Row>
      {/* <Col xs>
        <FieldSelection
          dataOptions={[]}
          labelId="ui-invoice.adjustment.type"
          name={`${elem}.type`}
          required
          validate={validateRequired}
        />
      </Col> */}
      <Col xs>
        <Field
          component={TextField}
          disabled
          label={<FormattedMessage id="ui-invoice.adjustment.type" />}
          name={`${elem}.type`}
        />
      </Col>
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
    </Row>
  );
};

const AdjustmentsForm = () => (
  <Row>
    <Col xs={12}>
      <FieldArray
        addLabel={<FormattedMessage id="ui-invoice.button.addAdjustment" />}
        component={RepeatableField}
        name="adjustments"
        renderField={Adjustment}
      />
    </Col>
  </Row>
);

export default AdjustmentsForm;
