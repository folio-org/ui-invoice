import { useIntl } from 'react-intl';

import { renderHook } from '@folio/jest-config-stripes/testing-library/react';
import {
  fetchAllRecords,
  fetchExportDataByIds,
} from '@folio/stripes-acq-components';

import { invoice } from 'fixtures';

import { getExportData } from './getExportData';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  fetchAllRecords: jest.fn(),
  fetchExportDataByIds: jest.fn(),
}));

const invoiceDataMock = [{ ...invoice }];

describe('getExportData', () => {
  beforeEach(() => {
    fetchAllRecords.mockClear().mockReturnValue(invoiceDataMock);
    fetchExportDataByIds.mockClear().mockResolvedValue([]);
  });

  it('should return export report object', async () => {
    const { result } = renderHook(() => useIntl());
    const intl = result.current;

    const report = await getExportData({ intl });

    expect(report[0]).toEqual(expect.objectContaining({
      accountingCode: invoice.accountingCode,
    }));
  });
});
