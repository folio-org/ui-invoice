import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { renderHook } from '@testing-library/react-hooks';

import { useOkapiKy } from '@folio/stripes/core';

import { FISCAL_YEARS_API } from '../../constants';
import { useFiscalYears } from './useFiscalYears';

jest.mock('react-intl', () => ({
  ...jest.requireActual('react-intl'),
  useIntl: jest.fn(() => ({
    formatDate: jest.fn((date) => date),
  })),
}));

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
    json: () => Promise.resolve({ fiscalYears: [fiscalYearMock] }),
  })),
};

describe('useFiscalYears', () => {
  beforeEach(() => {
    kyMock.get.mockClear();
    useOkapiKy.mockClear().mockReturnValue(kyMock);
  });

  it('should fetch all fiscal years', async () => {
    const { result, waitFor } = renderHook(() => useFiscalYears(), { wrapper });

    await waitFor(() => !result.current.isLoading);

    expect(kyMock.get).toHaveBeenCalledWith(
      FISCAL_YEARS_API,
      expect.objectContaining({
        searchParams: expect.objectContaining({
          query: expect.stringMatching(/code="\*" sortby code\/sort.descending/),
        }),
      }),
    );
    expect(result.current.fiscalYears).toEqual([fiscalYearMock]);
  });
});
