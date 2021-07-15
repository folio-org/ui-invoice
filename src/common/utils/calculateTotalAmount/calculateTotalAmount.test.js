import { getMoneyMultiplier } from '@folio/stripes-acq-components';

import { adjustment } from '../../../../test/jest/fixtures';
import {
  ADJUSTMENT_RELATION_TO_TOTAL_VALUES,
  ADJUSTMENT_TYPE_VALUES,
} from '../../constants';

import { calculateTotalAmount } from './calculateTotalAmount';

jest.mock('@folio/stripes-acq-components', () => ({
  getMoneyMultiplier: jest.fn().mockReturnValue(100),
}));

const currency = 'USD';

describe('calculateTotalAmount', () => {
  it('should get multiplier based on currency', () => {
    calculateTotalAmount({}, currency);

    expect(getMoneyMultiplier).toHaveBeenCalledWith(currency);
  });

  it('should calculate total ammount without adjustments', () => {
    const subTotal = 54.23;

    expect(calculateTotalAmount({ subTotal }, currency)).toBe(subTotal);
  });

  it('should calculate total ammount with adjustments', () => {
    const subTotal = 54.23;
    const adjustments = [
      {
        ...adjustment,
        type: ADJUSTMENT_TYPE_VALUES.amount,
        relationToTotal: ADJUSTMENT_RELATION_TO_TOTAL_VALUES.inAdditionTo,
      },
      {
        ...adjustment,
        type: ADJUSTMENT_TYPE_VALUES.percent,
        relationToTotal: ADJUSTMENT_RELATION_TO_TOTAL_VALUES.inAdditionTo,
      },
      {
        ...adjustment,
        type: ADJUSTMENT_TYPE_VALUES.amount,
        relationToTotal: ADJUSTMENT_RELATION_TO_TOTAL_VALUES.separateFrom,
      },
    ];

    expect(calculateTotalAmount({ subTotal, adjustments }, currency)).toBe(93.56);
  });
});
