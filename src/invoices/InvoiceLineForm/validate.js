import { validateFundDistribution } from '@folio/stripes-acq-components';

import { calculateTotalAmount } from '../../common/utils';

function validate(values) {
  const errors = {};
  const totalAmount = calculateTotalAmount(values);
  const fundDistributionErrors = validateFundDistribution(values.fundDistributions, totalAmount);

  if (fundDistributionErrors) errors.fundDistributions = fundDistributionErrors;

  return errors;
}

export default validate;
