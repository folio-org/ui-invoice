import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { renderHook } from '@testing-library/react-hooks';

import { useOkapiKy } from '@folio/stripes/core';

import { FISCAL_YEARS_API } from '../../constants';
import { useFiscalYear } from './useFiscalYear';

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const fiscalYearMock = {
  id: 'fyId',
  code: 'FY2023',
};
const kyMock = {
  get: jest.fn(() => ({
    json: () => Promise.resolve(fiscalYearMock),
  })),
};

describe('useFiscalYear', () => {
  beforeEach(() => {
    kyMock.get.mockClear();
    useOkapiKy.mockClear().mockReturnValue(kyMock);
  });

  it('should fetch fiscal year by ID', async () => {
    const { result, waitFor } = renderHook(() => useFiscalYear(fiscalYearMock.id), { wrapper });

    await waitFor(() => !result.current.isLoading);

    expect(kyMock.get).toHaveBeenCalledWith(`${FISCAL_YEARS_API}/${fiscalYearMock.id}`, expect.objectContaining({}));
    expect(result.current.fiscalYear).toEqual(fiscalYearMock);
  });
});
