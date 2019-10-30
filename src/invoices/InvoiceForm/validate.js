import { validateFundDistribution } from '@folio/stripes-acq-components';

import { ADJUSTMENT_PRORATE_VALUES } from '../../common/constants';
import { calculateAdjustmentAmount } from '../../common/utils';

function validate(values) {
  const errors = {};
  const adjustments = values.adjustments || [];
  const adjustmentsErrors = [];

  adjustments.forEach((adjustment, index) => {
    const { value, fundDistributions, prorate } = adjustment;

    if (prorate === ADJUSTMENT_PRORATE_VALUES.notProrated && fundDistributions && value) {
      const adjustmentAmount = calculateAdjustmentAmount(adjustment, values.subTotal);
      const fundDistributionErrors = validateFundDistribution(fundDistributions, adjustmentAmount);

      if (fundDistributionErrors) adjustmentsErrors[index] = { fundDistributions: fundDistributionErrors };
    }
  });
  if (adjustmentsErrors.length) errors.adjustments = adjustmentsErrors;

  return errors;
}

export default validate;
