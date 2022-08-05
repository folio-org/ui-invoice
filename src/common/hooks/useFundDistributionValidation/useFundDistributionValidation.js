import { useMutation } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { VALIDATE_INVOICE_FUND_DISTRIBUTION_API } from '../../constants';

export const useFundDistributionValidation = ({ formValues = {}, currency }) => {
  const ky = useOkapiKy();

  const mutationFn = (fundDistribution = []) => {
    return ky.put(VALIDATE_INVOICE_FUND_DISTRIBUTION_API, {
      json: {
        adjustments: formValues.adjustments,
        currency,
        fundDistribution,
        subTotal: formValues.subTotal || 0,
      },
    });
  };

  const { mutateAsync } = useMutation({ mutationFn });

  return {
    validateFundDistributionTotal: mutateAsync,
  };
};
