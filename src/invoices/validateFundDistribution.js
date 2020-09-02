import { validateFundDistributionFinal } from '@folio/stripes-acq-components';

import { calculateAdjustmentAmount } from '../common/utils';

function validateFundDistribution(fundDistribution, formValues) {
  const currency = formValues?.currency;
  const subTotal = Number(formValues.subTotal || 0);
  const adjustments = formValues?.adjustments || [];
  const adjustment = adjustments.find(({ fundId }) => fundId === fundDistribution?.fundId);
  const adjustmentValue = adjustment?.value;

  if (fundDistribution && adjustmentValue) {
    const adjustmentAmount = calculateAdjustmentAmount(adjustment, subTotal, currency);

    return validateFundDistributionFinal(fundDistribution, adjustmentAmount, currency);
  }

  return undefined;
}

export default validateFundDistribution;
