import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import {
  Pluggable,
} from '@folio/stripes/core';
import {
  useModalToggle,
  useShowCallout,
} from '@folio/stripes-acq-components';

import { useInvoiceLineMutation } from '../../../../common/hooks';
import { convertToInvoiceLineFields } from '../../../utils';

export const InvoiceLineOrderLineLink = ({ invoice, invoiceLine, vendor, refreshData }) => {
  const intl = useIntl();
  const showCallout = useShowCallout();
  const [isLinking, toggleIsLinking] = useModalToggle();

  const { mutateInvoiceLine } = useInvoiceLineMutation();

  useEffect(() => {
    if (invoiceLine) {
      toggleIsLinking();
    }
  }, [invoiceLine, toggleIsLinking]);

  const linkOrderLine = async ([orderLine]) => {
    const invoiceLineUpdates = invoice.source === 'EDI'
      ? {
        description: orderLine.titleOrPackage,
        fundDistributions: orderLine.fundDistribution,
      }
      : convertToInvoiceLineFields(orderLine, vendor);

    await mutateInvoiceLine({
      data: {
        ...invoiceLine,
        ...invoiceLineUpdates,
        poLineId: orderLine.id,
      },
    });

    showCallout({
      messageId: 'ui-invoice.invoiceLine.relink.success',
      values: { poLineNumber: orderLine.poLineNumber },
    });

    await refreshData();
  };

  const cancelLinkOrderLine = () => {
    toggleIsLinking();
  };

  return isLinking && (
    <Pluggable
      addLines={linkOrderLine}
      aria-haspopup="true"
      dataKey="find-po-line"
      isSingleSelect
      type="find-po-line"
      trigerless
      onClose={cancelLinkOrderLine}
    >
      {intl.formatMessage({ id: 'ui-invoice.find-po-line-plugin-unavailable' })}
    </Pluggable>
  );
};

InvoiceLineOrderLineLink.propTypes = {
  invoice: PropTypes.object.isRequired,
  vendor: PropTypes.object.isRequired,
  invoiceLine: PropTypes.object.isRequired,
  refreshData: PropTypes.func.isRequired,
};
