import { validateFundDistribution } from '@folio/stripes-acq-components';

import { ADJUSTMENT_PRORATE_VALUES } from '../../common/constants';
import { calculateAdjustmentAmount } from '../../common/utils';

function validate(values, { stripes }) {
  const errors = {};
  const adjustments = values.adjustments || [];
  const currency = values.currency || stripes.currency;
  const adjustmentsErrors = [];

  adjustments.forEach((adjustment, index) => {
    const { value, fundDistributions, prorate } = adjustment;

    if (prorate === ADJUSTMENT_PRORATE_VALUES.notProrated && fundDistributions && value) {
      const adjustmentAmount = calculateAdjustmentAmount(adjustment, values.subTotal, currency);
      const fundDistributionErrors = validateFundDistribution(fundDistributions, adjustmentAmount, currency);

      if (fundDistributionErrors) adjustmentsErrors[index] = { fundDistributions: fundDistributionErrors };
    }
  });
  if (adjustmentsErrors.length) errors.adjustments = adjustmentsErrors;

  return errors;
}

export default validate;
