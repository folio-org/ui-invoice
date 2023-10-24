import { useIntl } from 'react-intl';
import { keyBy } from 'lodash';

import { renderHook } from '@folio/jest-config-stripes/testing-library/react';

import {
  acqUnit,
  address,
  batchGroup,
  exportReport,
  invoice,
  invoiceLine,
  orderLine,
  vendor,
} from 'fixtures';
import { createExportReport } from './createExportReport';

test('createExportReport should return export report object', () => {
  const { result } = renderHook(() => useIntl());
  const intl = result.current;

  expect(createExportReport({
    acqUnitMap: keyBy([acqUnit], 'id'),
    addressMap: keyBy([address], 'id'),
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
