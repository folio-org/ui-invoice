import { validateFundDistribution } from '@folio/stripes-acq-components';

function validate(values) {
  const errors = {};
  const fundDistributionErrors = validateFundDistribution(values.fundDistributions);

  if (fundDistributionErrors) errors.fundDistributions = fundDistributionErrors;

  return errors;
}

export default validate;
