import { useCallback } from 'react';
import {
  useHistory,
  useLocation,
  useParams,
} from 'react-router-dom';

import { Paneset } from '@folio/stripes/components';
import {
  LoadingPane,
  useShowCallout,
} from '@folio/stripes-acq-components';

import {
  useInvoice,
  useInvoiceLineMutation,
  useOrders,
  useVendors,
} from '../../common/hooks';
import { InvoiceLinesSequence } from './InvoiceLinesSequence';
import { useLinesSequence } from './useLinesSequence';

export const InvoiceLinesSequenceContainer = () => {
  const { state } = useLocation();
  const { id: invoiceId } = useParams();
  const history = useHistory();

  const { mutateInvoiceLine } = useInvoiceLineMutation();
  const showCallout = useShowCallout();

  const {
    isLoading: isInvoiceLoading,
    invoice,
  } = useInvoice(invoiceId);

  const {
    isLoading: isOrdersLoading,
    orders,
  } = useOrders(state?.orderIds);

  const {
    isLoading: isVendorsLoading,
    vendors,
  } = useVendors(orders?.map(({ vendor }) => vendor));

  const {
    isLoading: isSequenceLoading,
    lines,
    poLines,
  } = useLinesSequence({ invoice, orders });

  const addLines = useCallback((orderedLines, { setIsSaving }) => {
    setIsSaving(true);
    orderedLines.reduce((acc, data) => {
      return acc.then(() => mutateInvoiceLine({ data }));
    }, Promise.resolve())
      .then(() => {
        history.push(`/invoice/view/${invoiceId}`);
      })
      .catch(() => {
        showCallout({
          messageId: 'ui-invoice.invoice.actions.saveLine.error',
          type: 'error',
        });
      })
      .finally(setIsSaving);
  }, [history, invoiceId, mutateInvoiceLine, showCallout]);

  const onClose = useCallback(() => {
    history.push(`/invoice/view/${invoiceId}`);
  }, [history, invoiceId]);

  const isLoading = (
    isInvoiceLoading
      || isSequenceLoading
      || isOrdersLoading
      || isVendorsLoading
  );

  if (isLoading) {
    return (
      <Paneset>
        <LoadingPane onClose={onClose} />
      </Paneset>
    );
  }

  return (
    <InvoiceLinesSequence
      addLines={addLines}
      invoice={invoice}
      lines={lines}
      onClose={onClose}
      orders={orders}
      poLines={poLines}
      vendors={vendors}
    />
  );
};
