import { validateFundDistribution } from '@folio/stripes-acq-components';

import { calculateTotalAmount } from '../../common/utils';

function validate(values, { stripes }) {
  const errors = {};
  const totalAmount = calculateTotalAmount(values, stripes);
  const fundDistributionErrors = validateFundDistribution(values.fundDistributions, totalAmount, stripes);

  if (fundDistributionErrors) errors.fundDistributions = fundDistributionErrors;

  return errors;
}

export default validate;
