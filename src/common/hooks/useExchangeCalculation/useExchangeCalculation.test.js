import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { renderHook, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { CALCULATE_EXCHANGE_API } from '../../constants';
import { useExchangeCalculation } from './useExchangeCalculation';

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const kyMock = {
  get: jest.fn(() => ({
    json: () => Promise.resolve(30),
  })),
};

const searchParams = {
  from: 'USD',
  to: 'EUR',
  amount: 100,
  rate: 1.2,
};

describe('useExchangeCalculation', () => {
  beforeEach(() => {
    kyMock.get.mockClear();
    useOkapiKy.mockClear().mockReturnValue(kyMock);
  });

  it('should return calculated exchange amount', async () => {
    const { result } = renderHook(() => useExchangeCalculation(searchParams), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(kyMock.get).toHaveBeenCalledWith(
      `${CALCULATE_EXCHANGE_API}`,
      expect.objectContaining({
        searchParams,
      }),
    );
    expect(result.current.exchangedAmount).toEqual(30);
  });
});
