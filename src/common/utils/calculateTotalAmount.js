import { get } from 'lodash';

import {
  ADJUSTMENT_RELATION_TO_TOTAL_VALUES,
  ADJUSTMENT_TYPE_VALUES,
} from '../constants';

export const calculateAdjustmentAmount = (adjustment, invoiceSubTotal = 0) => {
  const adjustmentValue = get(adjustment, 'value') || 0;
  const adjustmentType = get(adjustment, 'type', ADJUSTMENT_TYPE_VALUES.amount);

  return adjustmentType === ADJUSTMENT_TYPE_VALUES.amount
    ? adjustmentValue
    : invoiceSubTotal * adjustmentValue / 100;
};

export const calculateTotalAmount = (formValues) => {
  const subTotal = get(formValues, 'subTotal', 0);
  const adjustments = get(formValues, 'adjustments', []);
  const adjustmentsTotal = adjustments.reduce((sum, adjustment) => {
    const adjustmentRelationToTotal = get(adjustment, 'relationToTotal');
    const total = calculateAdjustmentAmount(adjustment, subTotal);

    if (adjustmentRelationToTotal === ADJUSTMENT_RELATION_TO_TOTAL_VALUES.inAdditionTo) {
      return sum + total;
    }

    return sum;
  }, 0);

  return subTotal + adjustmentsTotal;
};
