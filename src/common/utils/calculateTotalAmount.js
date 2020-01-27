import { get } from 'lodash';

import { getMoneyMultiplier } from '@folio/stripes-acq-components';

import {
  ADJUSTMENT_RELATION_TO_TOTAL_VALUES,
  ADJUSTMENT_TYPE_VALUES,
} from '../constants';

export const calculateAdjustmentAmount = (adjustment, invoiceSubTotal, currency) => {
  const multiplier = getMoneyMultiplier(currency);
  const adjustmentValue = Number(get(adjustment, 'value') || 0);
  const adjustmentType = get(adjustment, 'type', ADJUSTMENT_TYPE_VALUES.amount);

  const amount = adjustmentType === ADJUSTMENT_TYPE_VALUES.amount
    ? adjustmentValue
    : (invoiceSubTotal * adjustmentValue) / 100;

  return Math.round(amount * multiplier) / multiplier;
};

export const calculateTotalAmount = (formValues, currency) => {
  const multiplier = getMoneyMultiplier(currency);
  const subTotal = Number(get(formValues, 'subTotal') || 0);
  const adjustments = get(formValues, 'adjustments', []);
  const adjustmentsTotal = adjustments.reduce((sum, adjustment) => {
    const adjustmentRelationToTotal = get(adjustment, 'relationToTotal');
    const total = calculateAdjustmentAmount(adjustment, subTotal, currency);

    if (adjustmentRelationToTotal === ADJUSTMENT_RELATION_TO_TOTAL_VALUES.inAdditionTo) {
      return sum + total;
    }

    return sum;
  }, 0);

  return Math.round((subTotal + adjustmentsTotal) * multiplier) / multiplier;
};
