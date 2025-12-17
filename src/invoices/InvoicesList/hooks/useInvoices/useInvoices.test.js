import queryString from 'query-string';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { useLocation } from 'react-router';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import {
  useOkapiKy,
  useStripes,
} from '@folio/stripes/core';
import { NO_DST_TIMEZONES } from '@folio/stripes-acq-components/test/jest/fixtures';

import { invoice } from 'fixtures';
import { FILTERS } from '../../constants';
import { useInvoices } from './useInvoices';

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useLocation: jest.fn(),
}));
jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useNamespace: () => ['namespace'],
  useOkapiKy: jest.fn(),
  useStripes: jest.fn(),
}));

const invoices = [invoice];

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const renderTestHook = (...args) => renderHook(() => useInvoices(...args), { wrapper });
const waitForLoading = (result) => waitFor(() => expect(result.current.isFetching).toBeFalsy());

describe('useInvoices', () => {
  const getMock = jest.fn(() => ({
    json: () => ({
      invoices,
      totalRecords: invoices.length,
    }),
  }));

  beforeEach(() => {
    useLocation.mockReturnValue({ search: '' });
    useOkapiKy.mockReturnValue({ get: getMock });
    useStripes.mockReturnValue({ timezone: NO_DST_TIMEZONES.UTC });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return an empty list if there no filters were passed in the query', async () => {
    const { result } = renderTestHook({
      pagination: { limit: 5, offset: 0, timestamp: 42 },
    });

    await waitForLoading(result);

    expect(result.current).toEqual({
      invoices: [],
      invoicesCount: 0,
      isFetching: false,
    });
  });

  it('should call fetchVendors to load invoice related vendors', async () => {
    useLocation.mockReturnValue({ search: 'vendorId=vendorId' });

    const fetchVendors = jest.fn().mockReturnValue(Promise.resolve({}));
    const { result } = renderTestHook({
      pagination: { limit: 5, offset: 0, timestamp: 42 },
      fetchVendors,
    });

    await waitForLoading(result);

    expect(fetchVendors).toHaveBeenCalled();
  });

  it('should return fetched hydrated invoice list', async () => {
    useLocation.mockReturnValue({ search: 'vendorId=vendorId' });

    const fetchVendors = jest.fn().mockReturnValue(Promise.resolve({
      [invoice.vendorId]: { id: invoice.vendorId },
    }));
    const { result } = renderTestHook({
      pagination: { limit: 5, offset: 0, timestamp: 42 },
      fetchVendors,
    });

    await waitForLoading(result);

    expect(result.current.invoices[0].vendor.id).toEqual(invoice.vendorId);
  });

  describe('Datetime filters', () => {
    const dateTimeConfig = {
      from: '2010-01-01',
      to: '2019-12-31',
    };

    const expectedResultsDict = {
      [NO_DST_TIMEZONES.AFRICA_DAKAR]: {
        start: '2010-01-01T00:00:00.000',
        end: '2019-12-31T23:59:59.999',
      },
      [NO_DST_TIMEZONES.AMERICA_BOGOTA]: {
        start: '2010-01-01T05:00:00.000',
        end: '2020-01-01T04:59:59.999',
      },
      [NO_DST_TIMEZONES.ASIA_DUBAI]: {
        start: '2009-12-31T20:00:00.000',
        end: '2019-12-31T19:59:59.999',
      },
      [NO_DST_TIMEZONES.ASIA_SHANGHAI]: {
        start: '2009-12-31T16:00:00.000',
        end: '2019-12-31T15:59:59.999',
      },
      [NO_DST_TIMEZONES.ASIA_TOKIO]: {
        start: '2009-12-31T15:00:00.000',
        end: '2019-12-31T14:59:59.999',
      },
      [NO_DST_TIMEZONES.EUROPE_MOSCOW]: {
        start: '2009-12-31T21:00:00.000',
        end: '2019-12-31T20:59:59.999',
      },
      [NO_DST_TIMEZONES.PACIFIC_TAHITI]: {
        start: '2010-01-01T10:00:00.000',
        end: '2020-01-01T09:59:59.999',
      },
      [NO_DST_TIMEZONES.UTC]: {
        start: '2010-01-01T00:00:00.000',
        end: '2019-12-31T23:59:59.999',
      },
    };

    const datetimeFilters = [
      FILTERS.DATE_CREATED,
      FILTERS.DATE_UPDATED,
      FILTERS.INVOICE_LINE_DATE_CREATED,
      FILTERS.INVOICE_LINE_DATE_UPDATED,
      FILTERS.APPROVAL_DATE,
      FILTERS.PAYMENT_DATE,
    ];

    const dateFilters = [
      FILTERS.INVOICE_DATE,
      FILTERS.PAYMENT_DUE,
    ];

    describe.each(Object.values(datetimeFilters))('Datetime range filter: %s', (filter) => {
      it.each(Object.keys(expectedResultsDict))('should properly apply filter for the timezone - %s', async (timezone) => {
        const search = queryString.stringify({
          [filter]: [dateTimeConfig.from, dateTimeConfig.to].join(':'),
        });

        useLocation.mockReturnValue({ search });
        useStripes.mockReturnValue({ timezone });
        const fetchVendors = jest.fn().mockReturnValue(Promise.resolve({}));

        const { start, end } = expectedResultsDict[timezone];

        renderTestHook({
          fetchVendors,
          pagination: { limit: 5, offset: 0, timestamp: 42 },
        });

        expect(getMock.mock.calls[0][1].searchParams.query).toContain(`(${filter}>="${start}" and ${filter}<="${end}")`);
      });
    });

    describe.each(Object.values(dateFilters))('Date range filter: %s', (filter) => {
      it.each(Object.keys(expectedResultsDict))('should properly apply filter for the timezone - %s', async (timezone) => {
        const search = queryString.stringify({
          [filter]: [dateTimeConfig.from, dateTimeConfig.to].join(':'),
        });

        useLocation.mockReturnValue({ search });
        useStripes.mockReturnValue({ timezone });
        const fetchVendors = jest.fn().mockReturnValue(Promise.resolve({}));

        renderTestHook({
          fetchVendors,
          pagination: { limit: 5, offset: 0, timestamp: 42 },
        });

        expect(getMock.mock.calls[0][1].searchParams.query).toContain(`(${filter}>="${dateTimeConfig.from}T00:00:00.000" and ${filter}<="${dateTimeConfig.to}T23:59:59.999")`);
      });
    });
  });
});
