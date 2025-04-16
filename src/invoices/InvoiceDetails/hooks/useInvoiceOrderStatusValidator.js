import { useCallback } from 'react';

import { ORDER_TYPE } from '../constants';

export function useInvoiceOrderStatusValidator({ invoice, invoiceLines, fiscalYears, orders }) {
  return useCallback(() => {
    const currentDate = new Date();

    const filteredPreviousFiscalYearsIds = fiscalYears
      .filter(fiscalYear => new Date(fiscalYear.periodEnd) < currentDate)
      .map(fiscalYear => fiscalYear.id);

    const hasReleaseEncumbrance = invoiceLines?.invoiceLines?.some((line) => line.releaseEncumbrance);
    const hasOneTimeOrder = orders.some((order) => order.orderType === ORDER_TYPE.ONE_TIME);
    const isPreviousFiscalYear = filteredPreviousFiscalYearsIds.includes(invoice.fiscalYearId);

    return hasReleaseEncumbrance && hasOneTimeOrder && isPreviousFiscalYear;
  }, [invoice, invoiceLines, fiscalYears, orders]);
}
