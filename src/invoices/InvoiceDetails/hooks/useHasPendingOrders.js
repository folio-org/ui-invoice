import { useMemo } from 'react';
import { ORDER_STATUSES } from '@folio/stripes-acq-components';
import { useOrders } from '../../../common/hooks';

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

    return orders.some(({ workflowStatus }) => workflowStatus === ORDER_STATUSES.pending);
  }, [orders, isLoading, isFetched]);

  return {
    isLoading: isLoading || false,
    hasPendingOrders,
  };
};
