import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import {
  Field,
  FieldArray,
} from 'redux-form';
import PropTypes from 'prop-types';
import { find } from 'lodash';

import {
  Button,
  ButtonGroup,
  Card,
  Col,
  IconButton,
  KeyValue,
  RepeatableField,
  Row,
  Selection,
  TextField,
} from '@folio/stripes/components';
import {
  FieldSelect,
  FundDistributionFields,
  parseNumberFieldValue,
} from '@folio/stripes-acq-components';

import {
  ADJUSTMENT_PRORATE_OPTIONS,
  ADJUSTMENT_PRORATE_VALUES,
  ADJUSTMENT_RELATION_TO_TOTAL_OPTIONS,
  ADJUSTMENT_TYPE_VALUES,
} from '../../common/constants';
import {
  getAdjustmentPresetOptions,
  validateRequired,
} from '../../common/utils';

const getAdjustmentFromPreset = ({ description, prorate, relationToTotal, type, defaultAmount }) => ({
  description,
  prorate,
  relationToTotal,
  type,
  value: defaultAmount,
});

const AdjustmentsForm = ({ adjustmentsPresets, disabled, isLineAdjustments }) => {
  const [adjPreset, setAdjPreset] = useState();
  const onAdd = (fields) => {
    const newAdjustment = adjPreset
      ? getAdjustmentFromPreset(adjPreset.adjustment)
      : { type: ADJUSTMENT_TYPE_VALUES.amount };

    if (isLineAdjustments) delete newAdjustment.prorate;

    fields.push(newAdjustment);
  };

  // eslint-disable-next-line react/prop-types
  const renderTypeToggle = ({ input: { value, onChange } }) => {
    return (
      <KeyValue label={<FormattedMessage id="ui-invoice.settings.adjustments.type" />}>
        <ButtonGroup
          fullWidth
          data-test-adjustments-type
        >
          <Button
            onClick={() => onChange(ADJUSTMENT_TYPE_VALUES.percent)}
            buttonStyle={value === ADJUSTMENT_TYPE_VALUES.percent ? 'primary' : 'default'}
            data-test-adjustments-type-percent
            disabled={disabled}
          >
            <FormattedMessage id="ui-invoice.adjustment.type.sign.percent" />
          </Button>
          <Button
            onClick={() => onChange(ADJUSTMENT_TYPE_VALUES.amount)}
            buttonStyle={value === ADJUSTMENT_TYPE_VALUES.amount ? 'primary' : 'default'}
            data-test-adjustments-type-amount
            disabled={disabled}
          >
            <FormattedMessage id="ui-invoice.adjustment.type.sign.amount" />
          </Button>
        </ButtonGroup>
      </KeyValue>
    );
  };

  const renderAdjustment = (elem, index, fields) => {
    const onRemove = () => {
      fields.remove(index);
    };
    const adjustment = fields.get(index);
    const showFundDistribution = !isLineAdjustments
      && adjustment.prorate === ADJUSTMENT_PRORATE_VALUES.notProrated
      && adjustment.type === ADJUSTMENT_TYPE_VALUES.amount;

    return (
      <Card
        headerEnd={(
          <FormattedMessage id="stripes-components.deleteThisItem">
            {label => (
              <IconButton
                data-test-repeatable-field-remove-item-button
                icon="trash"
                onClick={onRemove}
                size="medium"
                disabled={disabled}
                ariaLabel={label}
              />
            )}
          </FormattedMessage>
        )}
        headerStart={(
          <FormattedMessage
            id="ui-invoice.adjustment.headerLabel"
            values={{ index: index + 1 }}
          />
        )}
      >
        <Row>
          <Col
            data-test-adjustment-description
            xs
          >
            <Field
              component={TextField}
              fullWidth
              label={<FormattedMessage id="ui-invoice.adjustment.description" />}
              name={`${elem}.description`}
              required
              validate={validateRequired}
              disabled={disabled}
            />
          </Col>
          <Col
            data-test-adjustment-amount
            xs
          >
            <Field
              component={TextField}
              fullWidth
              label={<FormattedMessage id="ui-invoice.adjustment.amount" />}
              name={`${elem}.value`}
              required
              type="number"
              parse={parseNumberFieldValue}
              validate={validateRequired}
              disabled={disabled}
            />
          </Col>
          <Col xs>
            <Field
              label="label"
              name={`${elem}.type`}
              component={renderTypeToggle}
            />
          </Col>
          {
            !isLineAdjustments && (
              <Col xs>
                <FieldSelect
                  label={<FormattedMessage id="ui-invoice.settings.adjustments.prorate" />}
                  name={`${elem}.prorate`}
                  dataOptions={ADJUSTMENT_PRORATE_OPTIONS}
                  required
                  validate={validateRequired}
                  disabled={disabled}
                />
              </Col>
            )
          }
          <Col
            data-test-adjustment-relation-to-total
            xs
          >
            <FieldSelect
              label={<FormattedMessage id="ui-invoice.settings.adjustments.relationToTotal" />}
              name={`${elem}.relationToTotal`}
              dataOptions={ADJUSTMENT_RELATION_TO_TOTAL_OPTIONS}
              required
              validate={validateRequired}
              disabled={disabled}
            />
          </Col>
        </Row>
        {showFundDistribution && (
          <FundDistributionFields
            disabled={disabled}
            fundDistribution={adjustment.fundDistributions}
            name={`${elem}.fundDistributions`}
            totalAmount={adjustment.value}
          />
        )}
      </Card>
    );
  };

  return (
    <Row>
      <Col xs={12}>
        <Selection
          dataOptions={getAdjustmentPresetOptions(adjustmentsPresets)}
          label={<FormattedMessage id="ui-invoice.adjustment.presetAdjustment" />}
          onChange={(id) => setAdjPreset(find(adjustmentsPresets, { id }))}
          disabled={disabled}
        />
      </Col>
      <Col xs={12}>
        <FieldArray
          addLabel={<FormattedMessage id="ui-invoice.button.addAdjustment" />}
          canAdd={!disabled}
          canRemove={!disabled}
          component={RepeatableField}
          id="adjustments"
          name="adjustments"
          onAdd={onAdd}
          onRemove={false}
          renderField={renderAdjustment}
        />
      </Col>
    </Row>
  );
};

AdjustmentsForm.propTypes = {
  adjustmentsPresets: PropTypes.arrayOf(PropTypes.object),
  disabled: PropTypes.bool,
  isLineAdjustments: PropTypes.bool,
};

AdjustmentsForm.defaultProps = {
  adjustmentsPresets: [],
  disabled: false,
  isLineAdjustments: false,
};

export default AdjustmentsForm;
