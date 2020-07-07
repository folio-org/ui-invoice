import {
  baseManifest,
  ORDERS_API,
} from '@folio/stripes-acq-components';

export const ordersResource = {
  ...baseManifest,
  path: ORDERS_API,
  records: 'purchaseOrders',
  accumulate: true,
  fetch: false,
};
