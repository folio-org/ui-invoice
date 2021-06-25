import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import {
  Pluggable,
} from '@folio/stripes/core';
import {
  IconButton,
  NoValue,
} from '@folio/stripes/components';
import {
  useShowCallout,
} from '@folio/stripes-acq-components';

import { useInvoiceLineMutation } from '../../../../common/hooks';
import { IS_EDIT_POST_APPROVAL } from '../../../../common/utils';
import { convertToInvoiceLineFields } from '../../../utils';

export const InvoiceLinePOLineNumber = ({ invoice, vendor, invoiceLine, poLineNumber, refreshData }) => {
  const intl = useIntl();
  const showCallout = useShowCallout();

  const { mutateInvoiceLine } = useInvoiceLineMutation();

  const isPostApproval = IS_EDIT_POST_APPROVAL(invoiceLine.id, invoiceLine.invoiceLineStatus);

  const selectOrderLine = async ([orderLine]) => {
    const invoiceLineUpdates = invoice.source === 'EDI'
      ? {
        description: orderLine.titleOrPackage,
        fundDistributions: orderLine.fundDistribution,
      }
      : convertToInvoiceLineFields(orderLine, vendor);

    await mutateInvoiceLine({
      ...invoiceLine,
      ...invoiceLineUpdates,
      poLineId: orderLine.id,
    });

    showCallout({
      messageId: 'ui-invoice.invoiceLine.relink.success',
      values: { poLineNumber: orderLine.poLineNumber },
    });

    await refreshData();
  };

  // eslint-disable-next-line react/prop-types
  const renderTrigger = ({ onClick, buttonRef }) => {
    const triggerPlugin = e => {
      e.stopPropagation();

      onClick();
    };

    return (
      <>
        {!isPostApproval && (
          <IconButton
            onClick={triggerPlugin}
            icon="link"
            size="medium"
            ref={buttonRef}
          />
        )}

        {poLineNumber || <NoValue />}
      </>
    );
  };

  return (
    <Pluggable
      addLines={selectOrderLine}
      aria-haspopup="true"
      dataKey="find-po-line"
      isSingleSelect
      type="find-po-line"
      renderTrigger={renderTrigger}
    >
      {intl.formatMessage({ id: 'ui-invoice.find-po-line-plugin-unavailable' })}
    </Pluggable>
  );
};

InvoiceLinePOLineNumber.propTypes = {
  invoice: PropTypes.object.isRequired,
  vendor: PropTypes.object.isRequired,
  invoiceLine: PropTypes.object.isRequired,
  poLineNumber: PropTypes.string,
  refreshData: PropTypes.func.isRequired,
};
