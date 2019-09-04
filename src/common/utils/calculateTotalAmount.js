import { get } from 'lodash';

import {
  ADJUSTMENT_RELATION_TO_TOTAL_VALUES,
  ADJUSTMENT_TYPE_VALUES,
} from '../constants';

// eslint-disable-next-line import/prefer-default-export
export const calculateTotalAmount = (formValues) => {
  const subTotal = get(formValues, 'subTotal', 0);
  const adjustments = get(formValues, 'adjustments', []);
  const adjustmentsTotal = adjustments.reduce((sum, adjustment) => {
    const adjustmentType = get(adjustment, 'type', ADJUSTMENT_TYPE_VALUES.amount);
    const adjustmentRelationToTotal = get(adjustment, 'relationToTotal');
    const total = adjustmentType === ADJUSTMENT_TYPE_VALUES.amount
      ? adjustment.value
      : subTotal * adjustment.value / 100;

    if (adjustmentRelationToTotal === ADJUSTMENT_RELATION_TO_TOTAL_VALUES.inAdditionTo) {
      return sum + total;
    }

    return sum;
  }, 0);

  return subTotal + adjustmentsTotal;
};
