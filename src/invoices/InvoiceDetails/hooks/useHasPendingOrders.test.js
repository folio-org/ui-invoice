import { renderHook } from '@folio/jest-config-stripes/testing-library/react';
import { ORDER_STATUSES } from '@folio/stripes-acq-components';

import { useOrders } from '../../../common/hooks';
import { useHasPendingOrders } from './useHasPendingOrders';

jest.mock('../../../common/hooks', () => ({
  useOrders: jest.fn().mockReturnValue({ orders: [], isLoading: false }),
}));

const ordersLineMap = { purchaseOrderId: 'orderID' };

describe('useHasPendingOrders', () => {
  it('should return hasPendingOrders: false', async () => {
    const { result } = renderHook(() => useHasPendingOrders(ordersLineMap));

    expect(result.current.isLoading).toBeFalsy();
    expect(result.current.hasPendingOrders).toBeFalsy();
  });

  it('should return hasPendingOrders: false', async () => {
    useOrders.mockReturnValue({ orders: [], isLoading: true });
    const { result } = renderHook(() => useHasPendingOrders(ordersLineMap));

    expect(result.current.isLoading).toBeTruthy();
    expect(result.current.hasPendingOrders).toBeFalsy();
  });

  it('should return hasPendingOrders: true', async () => {
    useOrders.mockReturnValue({ orders: [{ workflowStatus: ORDER_STATUSES.pending }] });
    const { result } = renderHook(() => useHasPendingOrders(ordersLineMap));

    expect(result.current.isLoading).toBeFalsy();
    expect(result.current.hasPendingOrders).toBeTruthy();
  });
});
