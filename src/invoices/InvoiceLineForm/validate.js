import { validateFundDistribution } from '@folio/stripes-acq-components';

import { calculateTotalAmount } from '../../common/utils';

function validate(values, { stripes }) {
  const errors = {};
  const totalAmount = calculateTotalAmount(values, stripes.currency);
  const fundDistributionErrors = validateFundDistribution(values.fundDistributions, totalAmount, stripes.currency);

  if (fundDistributionErrors) errors.fundDistributions = fundDistributionErrors;

  return errors;
}

export default validate;
