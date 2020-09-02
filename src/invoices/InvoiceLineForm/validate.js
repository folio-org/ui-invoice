import { validateFundDistributionFinal } from '@folio/stripes-acq-components';

import { calculateTotalAmount } from '../../common/utils';

function validate(currency, fundDistribution, formValues) {
  if (fundDistribution) {
    const totalAmount = calculateTotalAmount(formValues, currency);

    return validateFundDistributionFinal(fundDistribution, totalAmount, currency);
  }

  return undefined;
}

export default validate;
