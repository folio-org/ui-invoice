import { QueryClient, QueryClientProvider } from 'react-query';

import { renderHook, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { VALIDATE_INVOICE_FUND_DISTRIBUTION_API } from '../../constants';
import { useFundDistributionValidation } from './useFundDistributionValidation';

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useOkapiKy: jest.fn(),
}));

const adjustments = [];
const currency = 'USD';
const fundDistribution = [{
  code: 'ASIAHIST',
  value: 100,
  fundId: '55f48dc6-efa7-4cfe-bc7c-4786efe493e3',
  encumbrance: null,
  expenseClassId: null,
  distributionType: 'percentage',
}];
const subTotal = 10;
const putMock = jest.fn();

const queryClient = new QueryClient();
// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useFundDistributionValidation', () => {
  beforeEach(() => {
    putMock.mockClear();
    useOkapiKy
      .mockClear()
      .mockReturnValue({
        get: () => ({
          json: () => ({}),
        }),
        put: putMock,
      });
  });

  it('should send PUT request for validation', async () => {
    const { result } = renderHook(
      () => useFundDistributionValidation({ adjustments, currency, subTotal }),
      { wrapper },
    );

    await result.current.validateFundDistributionTotal({
      adjustments,
      currency,
      fundDistribution,
      subTotal,
    });
    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(putMock).toHaveBeenCalledWith(VALIDATE_INVOICE_FUND_DISTRIBUTION_API, expect.objectContaining({}));
  });
});
