import { renderHook } from '@folio/jest-config-stripes/testing-library/react';
import { ORDER_STATUSES } from '@folio/stripes-acq-components';

import { ORDER_TYPE } from '../constants';
import { useInvoiceOrderStatusValidator } from './useInvoiceOrderStatusValidator';

describe('useInvoiceOrderStatusValidator', () => {
  const baseInvoice = { fiscalYearId: 'fy-1' };

  const baseInvoiceLines = {
    invoiceLines: [
      { releaseEncumbrance: true },
      { releaseEncumbrance: false },
    ],
  };

  const baseFiscalYears = [
    {
      id: 'fy-1',
      periodEnd: new Date(Date.now() - 100000000).toISOString(),
    },
    {
      id: 'fy-2',
      periodEnd: new Date(Date.now() + 100000000).toISOString(),
    },
  ];

  const oneTimeOrders = [
    {
      orderType: ORDER_TYPE.ONE_TIME,
      workflowStatus: ORDER_STATUSES.open,
    },
    {
      orderType: ORDER_TYPE.ONGOING,
      workflowStatus: ORDER_STATUSES.open,
    },
  ];

  it('should return true when all conditions are met', () => {
    const { result } = renderHook(() => useInvoiceOrderStatusValidator({
      invoice: baseInvoice,
      invoiceLines: baseInvoiceLines,
      fiscalYears: baseFiscalYears,
      orders: oneTimeOrders,
    }));

    expect(result.current()).toBe(true);
  });

  it('should return false when no releaseEncumbrance', () => {
    const invoiceLines = {
      invoiceLines: [
        { releaseEncumbrance: false },
      ],
    };

    const { result } = renderHook(() => useInvoiceOrderStatusValidator({
      invoice: baseInvoice,
      invoiceLines,
      fiscalYears: baseFiscalYears,
      orders: oneTimeOrders,
    }));

    expect(result.current()).toBe(false);
  });

  it('should return false when no One-Time order exists', () => {
    const orders = [
      {
        orderType: ORDER_TYPE.ONGOING,
        workflowStatus: ORDER_STATUSES.open,
      },
    ];

    const { result } = renderHook(() => useInvoiceOrderStatusValidator({
      invoice: baseInvoice,
      invoiceLines: baseInvoiceLines,
      fiscalYears: baseFiscalYears,
      orders,
    }));

    expect(result.current()).toBe(false);
  });

  it('should return false when no One-Time order exists in Open status', () => {
    const orders = [
      {
        orderType: ORDER_TYPE.ONE_TIME,
        workflowStatus: ORDER_STATUSES.pending,
      },
    ];

    const { result } = renderHook(() => useInvoiceOrderStatusValidator({
      invoice: baseInvoice,
      invoiceLines: baseInvoiceLines,
      fiscalYears: baseFiscalYears,
      orders,
    }));

    expect(result.current()).toBe(false);
  });

  it('should return false when fiscalYear is not in previous fiscal years', () => {
    const invoice = { fiscalYearId: 'fy-2' };

    const { result } = renderHook(() => useInvoiceOrderStatusValidator({
      invoice,
      invoiceLines: baseInvoiceLines,
      fiscalYears: baseFiscalYears,
      orders: oneTimeOrders,
    }));

    expect(result.current()).toBe(false);
  });
});
