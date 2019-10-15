import { validateFundDistribution } from '@folio/stripes-acq-components';

import { ADJUSTMENT_PRORATE_VALUES } from '../../common/constants';

function validate(values) {
  const errors = {};
  const adjustments = values.adjustments || [];
  const adjustmentsErrors = [];

  adjustments.forEach(({ value, fundDistributions, prorate }, index) => {
    if (prorate === ADJUSTMENT_PRORATE_VALUES.notProrated && fundDistributions && value) {
      const fundDistributionErrors = validateFundDistribution(fundDistributions, value);

      if (fundDistributionErrors) adjustmentsErrors[index] = { fundDistributions: fundDistributionErrors };
    }
  });
  if (adjustmentsErrors.length) errors.adjustments = adjustmentsErrors;

  return errors;
}

export default validate;
