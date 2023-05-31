import { useMemo } from 'react';
import { useOrders } from '../../../common/hooks';
import { ORDER_STATUS } from '../constants';

export const useHasPendingOrders = (orderLinesMap = {}) => {
  const orderIds = useMemo(() => {
    return Object.values(orderLinesMap)
      .map(({ purchaseOrderId }) => purchaseOrderId);
  }, [orderLinesMap]);

  const {
    isLoading,
    orders,
    isFetched,
  } = useOrders(orderIds, { skip: !orderIds.length });

  const hasPendingOrders = useMemo(() => {
    if (isLoading) {
      return true;
    }

    if (isFetched && !orders.length) {
      return false;
    }

    return orders.some(({ workflowStatus }) => workflowStatus === ORDER_STATUS.PENDING);
  }, [orders, isLoading, isFetched]);

  return {
    isLoading: isLoading || false,
    hasPendingOrders,
  };
};
