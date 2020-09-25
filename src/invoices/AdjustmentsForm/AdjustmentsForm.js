import React, { useCallback, useState } from 'react';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import PropTypes from 'prop-types';
import { find } from 'lodash';

import {
  Button,
  ButtonGroup,
  Card,
  Checkbox,
  Col,
  IconButton,
  KeyValue,
  RepeatableField,
  Row,
  Selection,
  TextField,
} from '@folio/stripes/components';
import {
  CurrencySymbol,
  FieldSelectFinal,
  FundDistributionFieldsFinal,
  parseNumberFieldValue,
  validateRequired,
} from '@folio/stripes-acq-components';
import {
  withStripes,
  stripesShape,
} from '@folio/stripes/core';

import {
  ADJUSTMENT_PRORATE_OPTIONS,
  ADJUSTMENT_PRORATE_VALUES,
  ADJUSTMENT_RELATION_TO_TOTAL_OPTIONS,
  ADJUSTMENT_RELATION_TO_TOTAL_VALUES,
  ADJUSTMENT_TYPE_VALUES,
} from '../../common/constants';
import {
  calculateAdjustmentAmount,
  getAdjustmentPresetOptions,
} from '../../common/utils';
import { getAdjustmentFromPreset } from '../utils';
import AdjustmentsDetails from '../AdjustmentsDetails';

const AdjustmentsForm = ({
  adjustmentsPresets,
  change,
  currency,
  disabled,
  initialAdjustments,
  initialCurrency,
  invoiceSubTotal,
  isLineAdjustments,
  isNonInteractive,
  stripes,
}) => {
  const [adjPreset, setAdjPreset] = useState();
  const intl = useIntl();
  const onAdd = (fields) => {
    const newAdjustment = adjPreset
      ? getAdjustmentFromPreset(adjPreset.adjustment)
      : { type: ADJUSTMENT_TYPE_VALUES.amount };

    if (isLineAdjustments) delete newAdjustment.prorate;

    fields.push(newAdjustment);
  };

  const renderTypeToggle = useCallback(({ input: { value, onChange } }) => {
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
            <CurrencySymbol currency={currency} />
          </Button>
        </ButtonGroup>
      </KeyValue>
    );
  }, [currency, disabled]);

  const renderAdjustment = (elem, index, fields) => {
    const onRemove = () => {
      fields.remove(index);
    };
    const adjustment = fields.value[index];
    const showFundDistribution = !isLineAdjustments
      && adjustment.prorate === ADJUSTMENT_PRORATE_VALUES.notProrated
      && adjustment.relationToTotal !== ADJUSTMENT_RELATION_TO_TOTAL_VALUES.includedIn;

    const adjustmentAmount = calculateAdjustmentAmount(adjustment, invoiceSubTotal, currency || stripes.currency);

    return (
      <Card
        headerEnd={(
          <IconButton
            data-test-repeatable-field-remove-item-button
            icon="trash"
            onClick={onRemove}
            size="medium"
            disabled={disabled}
            ariaLabel={intl.formatMessage({ id: 'stripes-components.deleteThisItem' })}
          />
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
              id={`${elem}.description`}
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
              id={`${elem}.value`}
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
                <FieldSelectFinal
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
            <FieldSelectFinal
              label={<FormattedMessage id="ui-invoice.settings.adjustments.relationToTotal" />}
              name={`${elem}.relationToTotal`}
              dataOptions={ADJUSTMENT_RELATION_TO_TOTAL_OPTIONS}
              required
              validate={validateRequired}
              disabled={disabled}
            />
          </Col>
          <Col
            data-test-adjustment-export-to-accounting
            xs
          >
            <Field
              component={Checkbox}
              label={<FormattedMessage id="ui-invoice.settings.adjustments.exportToAccounting" />}
              name={`${elem}.exportToAccounting`}
              type="checkbox"
              vertical
            />
          </Col>
        </Row>
        {showFundDistribution && (
          <FundDistributionFieldsFinal
            change={change}
            currency={currency}
            disabled={disabled}
            fundDistribution={adjustment.fundDistributions}
            name={`${elem}.fundDistributions`}
            totalAmount={adjustmentAmount}
          />
        )}
      </Card>
    );
  };

  return (
    isNonInteractive
      ? (
        <AdjustmentsDetails
          adjustments={initialAdjustments}
          currency={initialCurrency}
        />
      )
      : (
        <Row>
          <Col xs={12}>
            <Selection
              dataOptions={getAdjustmentPresetOptions(adjustmentsPresets)}
              label={intl.formatMessage({ id: 'ui-invoice.adjustment.presetAdjustment' })}
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
      )
  );
};

AdjustmentsForm.propTypes = {
  adjustmentsPresets: PropTypes.arrayOf(PropTypes.object),
  change: PropTypes.func.isRequired,
  currency: PropTypes.string,
  disabled: PropTypes.bool,
  isLineAdjustments: PropTypes.bool,
  invoiceSubTotal: PropTypes.number,
  stripes: stripesShape,
  initialAdjustments: PropTypes.arrayOf(PropTypes.object),
  initialCurrency: PropTypes.string,
  isNonInteractive: PropTypes.bool,
};

AdjustmentsForm.defaultProps = {
  adjustmentsPresets: [],
  disabled: false,
  isLineAdjustments: false,
  invoiceSubTotal: 0,
  isNonInteractive: false,
};

export default withStripes(AdjustmentsForm);
