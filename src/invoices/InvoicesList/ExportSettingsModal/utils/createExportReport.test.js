import { useIntl } from 'react-intl';
import { keyBy, omit } from 'lodash';

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
import { EXPORT_INVOICE_LINE_FIELDS } from '../constants';
import { createExportReport } from './createExportReport';

const INVALID_REF = 'stripes-acq-components.invalidReference';

const voucher = {

};
const voucherLine = {

};

const defaultExportData = {
  acqUnitMap: keyBy([acqUnit], 'id'),
  addressMap: keyBy([address], 'id'),
  expenseClassMap: {},
  fiscalYearMap: { [invoice.fiscalYearId]: { code: 'FY2023' } },
  batchGroupMap: keyBy([batchGroup], 'id'),
  invoices: [invoice],
  poLineMap: keyBy([orderLine], 'id'),
  userMap: {},
  vendorMap: keyBy([vendor], 'id'),
  vouchers: [voucher],
  voucherLines: [voucherLine],
};

describe('createExportReport', () => {
  const { result } = renderHook(() => useIntl());

  it('should return export report object', () => {
    expect(createExportReport({
      intl: result.current,
      invoiceLines: [invoiceLine],
      ...defaultExportData,
    })).toEqual(exportReport);
  });

  it('should display \'invalid reference\' label for broken references', () => {
    expect(createExportReport({
      intl: result.current,
      ...defaultExportData,
      batchGroupMap: {},
      vendorMap: {},
    })).toEqual([expect.objectContaining({
      ...omit(exportReport[0], Object.keys(EXPORT_INVOICE_LINE_FIELDS)),
      totalUnits: 0,
      batchGroup: INVALID_REF,
      vendorCode: INVALID_REF,
      vendorAddress: '',
    })]);
  });
});
