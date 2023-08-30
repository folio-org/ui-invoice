import { useIntl } from 'react-intl';
import { keyBy } from 'lodash';

import { renderHook } from '@folio/jest-config-stripes/testing-library/react';

import { createExportReport } from './createExportReport';
import {
  acqUnit,
  address,
  batchGroup,
  exportReport,
  invoice,
  invoiceLine,
  orderLine,
  vendor,
} from '../../../../../test/jest/fixtures';

test('createExportReport should return export report object', () => {
  const { result } = renderHook(() => useIntl());
  const intl = result.current;

  expect(createExportReport({
    acqUnitMap: keyBy([acqUnit], 'id'),
    addressMap: keyBy([address], 'id'),
    exchangeRateMap: { [invoice.currency]: { from: invoice.currency, exchangeRate: 1 } },
    expenseClassMap: {},
    fiscalYearMap: { [invoice.fiscalYearId]: { code: 'FY2023' } },
    intl,
    invoiceLines: [invoiceLine],
    batchGroupMap: keyBy([batchGroup], 'id'),
    invoiceMap: keyBy([invoice], 'id'),
    poLineMap: keyBy([orderLine], 'id'),
    userMap: {},
    vendorMap: keyBy([vendor], 'id'),
  })).toEqual(exportReport);
});
