import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { stripesConnect } from '@folio/stripes/core';
import { ConfirmationModal } from '@folio/stripes/components';
import {
  batchFetch,
  useModalToggle,
  useShowCallout,
} from '@folio/stripes-acq-components';

import { ordersResource } from '../../../common/resources';
import AddInvoiceLinesAction from './AddInvoiceLinesAction';

const AddInvoiceLinesActionContainer = ({ addLines, isDisabled, invoiceCurrency, invoiceVendorId, mutator }) => {
  const [isCurrencyConfirmation, toggleCurrencyConfirmation] = useModalToggle();
  const [isVendorConfirmation, toggleVendorConfirmation] = useModalToggle();
  const [poLines, setPoLines] = useState();
  const showCallout = useShowCallout();

  const getVendorsIds = useCallback(
    async (ordersIds) => {
      let vendorsIds;

      try {
        const ordersResponse = await batchFetch(mutator.orders, ordersIds);

        vendorsIds = ordersResponse.map(({ vendor }) => vendor);
      } catch (e) {
        showCallout({ messageId: 'ui-invoice.invoice.actions.addLine.vendorLoadError', type: 'error' });
      }

      return vendorsIds;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [showCallout],
  );

  const validateCurrency = useCallback(
    (selectedPoLines) => {
      const currencies = selectedPoLines.map(line => line.cost.currency);

      return currencies.some(currency => currency !== invoiceCurrency)
        ? toggleCurrencyConfirmation()
        : addLines(selectedPoLines);
    },
    [invoiceCurrency, toggleCurrencyConfirmation, addLines],
  );

  const validateVendor = useCallback(
    async (selectedPoLines) => {
      const ordersIds = selectedPoLines.map(line => line.purchaseOrderId);
      const vendorsIds = await getVendorsIds(ordersIds);

      if (!vendorsIds) return null;

      return (
        vendorsIds.some(vendorId => vendorId !== invoiceVendorId)
          ? toggleVendorConfirmation()
          : validateCurrency(selectedPoLines)
      );
    },
    [invoiceVendorId, toggleVendorConfirmation, validateCurrency, getVendorsIds],
  );

  const validateSelectedLines = useCallback(
    (selectedPoLines) => {
      setPoLines(selectedPoLines);
      validateVendor(selectedPoLines);
    },
    [validateVendor],
  );

  return (
    <>
      <AddInvoiceLinesAction
        addLines={addLines}
        isDisabled={isDisabled}
        validateSelectedRecords={validateSelectedLines}
      />

      {isCurrencyConfirmation && (
        <ConfirmationModal
          id="invoice-line-currency-confirmation"
          confirmLabel={<FormattedMessage id="ui-invoice.invoice.actions.addLine.confirmLabel" />}
          heading={<FormattedMessage id="ui-invoice.invoice.actions.addLine.heading" />}
          message={<FormattedMessage id="ui-invoice.invoice.actions.addLine.currencyMessage" />}
          onCancel={toggleCurrencyConfirmation}
          onConfirm={() => {
            toggleCurrencyConfirmation();
            addLines(poLines);
          }}
          open
        />
      )}

      {isVendorConfirmation && (
        <ConfirmationModal
          id="invoice-line-vendor-confirmation"
          confirmLabel={<FormattedMessage id="ui-invoice.invoice.actions.addLine.confirmLabel" />}
          heading={<FormattedMessage id="ui-invoice.invoice.actions.addLine.heading" />}
          message={<FormattedMessage id="ui-invoice.invoice.actions.addLine.vendorMessage" />}
          onCancel={toggleVendorConfirmation}
          onConfirm={() => {
            toggleVendorConfirmation();
            validateCurrency(poLines);
          }}
          open
        />
      )}
    </>
  );
};

AddInvoiceLinesActionContainer.manifest = Object.freeze({
  orders: ordersResource,
});

AddInvoiceLinesActionContainer.propTypes = {
  addLines: PropTypes.func.isRequired,
  invoiceCurrency: PropTypes.string.isRequired,
  invoiceVendorId: PropTypes.string.isRequired,
  mutator: PropTypes.object.isRequired,
  isDisabled: PropTypes.bool,
};

AddInvoiceLinesActionContainer.defaultProps = {
  isDisabled: false,
};

export default stripesConnect(AddInvoiceLinesActionContainer);
