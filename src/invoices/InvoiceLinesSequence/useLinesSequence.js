import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';
import {
  batchRequest,
  LINES_API,
  PAYMENT_STATUS,
  VENDORS_API,
} from '@folio/stripes-acq-components';

import { createInvoiceLineFromPOL } from '../InvoiceDetails/utils';

const buildOrderLinesQuery = (chunk) => {
  const idsQuery = chunk.join(' or ');
  const paymentStatusQuery = [
    PAYMENT_STATUS.fullyPaid,
    PAYMENT_STATUS.paymentNotRequired,
  ].map(status => `"${status}"`).join(' or ');

  return [
    `purchaseOrderId==(${idsQuery})`,
    `paymentStatus<>(${paymentStatusQuery})`,
  ].join(' and ');
};

export const useLinesSequence = ({
  invoice = {},
  orders = [],
}) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'lines-sequence' });

  const { isLoading, data = {} } = useQuery(
    [namespace, invoice, orders],
    async () => {
      const vendor = await ky.get(`${VENDORS_API}/${invoice.vendorId}`).json();

      const poLines = await batchRequest(
        ({ params: searchParams }) => ky
          .get(LINES_API, { searchParams })
          .json()
          .then(({ poLines: orderLines }) => orderLines),
        orders.map(({ id }) => id),
        buildOrderLinesQuery,
      );

      return {
        lines: poLines.map(poLine => createInvoiceLineFromPOL(poLine, invoice.id, vendor)),
        poLines,
      };
    },
    { enabled: Boolean(invoice.id && orders.length) },
  );

  return ({
    lines: data.lines || [],
    poLines: data.poLines || [],
    isLoading,
  });
};
