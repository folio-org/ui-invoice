import { renderHook } from '@testing-library/react-hooks';
import { useOrders } from '../../../common/hooks';
import { ORDER_STATUS } from '../constants';
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
    expect(result.current.hasPendingOrders).toBeTruthy();
  });

  it('should return hasPendingOrders: true', async () => {
    useOrders.mockReturnValue({ orders: [{ workflowStatus: ORDER_STATUS.PENDING }] });
    const { result } = renderHook(() => useHasPendingOrders(ordersLineMap));

    expect(result.current.isLoading).toBeFalsy();
    expect(result.current.hasPendingOrders).toBeTruthy();
  });
});
