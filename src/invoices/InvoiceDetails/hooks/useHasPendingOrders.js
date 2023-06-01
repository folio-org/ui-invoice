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
  } = useOrders(orderIds);

  const hasPendingOrders = useMemo(() => {
    return orders.some(({ workflowStatus }) => workflowStatus === ORDER_STATUSES.pending);
  }, [orders]);

  return {
    isLoading,
    hasPendingOrders,
  };
};
