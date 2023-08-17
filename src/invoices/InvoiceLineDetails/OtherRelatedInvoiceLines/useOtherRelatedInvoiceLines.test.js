import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { renderHook } from '@testing-library/react-hooks';

import { useOkapiKy } from '@folio/stripes/core';
import {
  INVOICES_API,
  VENDORS_API,
} from '@folio/stripes-acq-components';

import {
  INVOICE_LINE_API,
  FISCAL_YEARS_API,
} from '../../../common/constants';
import { useOtherRelatedInvoiceLines } from './useOtherRelatedInvoiceLines';

const fiscalYear = {
  id: 'fiscalYearId',
};
const vendor = {
  id: 'vendorId',
};
const invoice = {
  id: 'invoiceId',
  vendorId: vendor.id,
  fiscalYearId: fiscalYear.id,
};
const invoiceLine = {
  id: 'invoiceLineId',
  invoiceId: invoice.id,
};
const poLine = {
  id: 'poLineId',
};

const resultData = [{
  ...invoiceLine,
  invoice,
  vendor,
  fiscalYear,
}];

const queryClient = new QueryClient();

const kyResponseMap = {
  [INVOICE_LINE_API]: { invoiceLines: [invoiceLine], totalRecords: 1 },
  [INVOICES_API]: { invoices: [invoice] },
  [VENDORS_API]: { organizations: [vendor] },
  [FISCAL_YEARS_API]: { fiscalYears: [fiscalYear] },
};

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useOtherRelatedInvoiceLines', () => {
  beforeEach(() => {
    useOkapiKy
      .mockClear()
      .mockReturnValue({
        get: (path) => ({
          json: () => kyResponseMap[path],
        }),
      });
  });

  it('should fetch connected to po line invoice lines', async () => {
    const { result, waitFor } = renderHook(
      () => useOtherRelatedInvoiceLines(
        invoiceLine.id,
        poLine.id,
      ),
      { wrapper },
    );

    await waitFor(() => !result.current.isLoading);

    expect(result.current.invoiceLines).toEqual(resultData);
    expect(result.current.totalInvoiceLines).toBe(1);
  });
});
