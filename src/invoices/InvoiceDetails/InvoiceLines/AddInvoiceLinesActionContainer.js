import PropTypes from 'prop-types';
import {
  useCallback,
  useEffect,
  useState,
} from 'react';
import { FormattedMessage } from 'react-intl';

import { stripesConnect } from '@folio/stripes/core';
import { ConfirmationModal } from '@folio/stripes/components';
import {
  batchFetch,
  useModalToggle,
  useShowCallout,
  useToggle,
} from '@folio/stripes-acq-components';

import { CurrencyMismatchModal } from '../../../common/components';
import { ordersResource } from '../../../common/resources';
import AddInvoiceLinesAction from './AddInvoiceLinesAction';

export const AddInvoiceLinesActionContainerComponent = ({
  addLines,
  invoiceCurrency,
  invoiceVendorId,
  mutator,
  onClose,
}) => {
  const [isAddInvoiceLines, toggleAddInvoiceLines] = useToggle(true);
  const [isCurrencyConfirmation, toggleCurrencyConfirmation] = useModalToggle();
  const [isVendorConfirmation, toggleVendorConfirmation] = useModalToggle();
  const [poLines, setPoLines] = useState();
  const showCallout = useShowCallout();

  useEffect(() => {
    if (!(isAddInvoiceLines || poLines?.length)) {
      onClose();
    }
  }, [poLines, isAddInvoiceLines, onClose]);

  const getVendorsIds = useCallback(
    async (ordersIds) => {
      let vendorsIds;

      try {
        const ordersResponse = await batchFetch(mutator.orders, ordersIds);

        vendorsIds = ordersResponse.map(({ vendor }) => vendor);
      } catch (e) {
        setPoLines(undefined);
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
      {
        isAddInvoiceLines && (
          <AddInvoiceLinesAction
            addLines={addLines}
            onClose={toggleAddInvoiceLines}
            validateSelectedRecords={validateSelectedLines}
          />
        )
      }

      <CurrencyMismatchModal
        onCancel={() => {
          toggleCurrencyConfirmation();
          setPoLines(undefined);
        }}
        onConfirm={() => {
          toggleCurrencyConfirmation();
          addLines(poLines);
          setPoLines(undefined);
        }}
        open={isCurrencyConfirmation}
      />

      {isVendorConfirmation && (
        <ConfirmationModal
          id="invoice-line-vendor-confirmation"
          confirmLabel={<FormattedMessage id="ui-invoice.invoice.actions.addLine.confirmLabel" />}
          heading={<FormattedMessage id="ui-invoice.invoice.actions.addLine.heading" />}
          message={<FormattedMessage id="ui-invoice.invoice.actions.addLine.vendorMessage" />}
          onCancel={() => {
            toggleVendorConfirmation();
            setPoLines(undefined);
          }}
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

AddInvoiceLinesActionContainerComponent.manifest = Object.freeze({
  orders: ordersResource,
});

AddInvoiceLinesActionContainerComponent.propTypes = {
  addLines: PropTypes.func.isRequired,
  invoiceCurrency: PropTypes.string.isRequired,
  invoiceVendorId: PropTypes.string.isRequired,
  mutator: PropTypes.object.isRequired,
  onClose: PropTypes.func,
};

export default stripesConnect(AddInvoiceLinesActionContainerComponent);
