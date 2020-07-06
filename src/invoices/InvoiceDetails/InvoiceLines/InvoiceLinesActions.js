import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Button,
} from '@folio/stripes/components';
import { IfPermission } from '@folio/stripes/core';

import AddInvoiceLinesActionContainer from './AddInvoiceLinesActionContainer';
import styles from './InvoiceLines.css';

const InvoiceLinesActions = ({ addLines, createLine, isDisabled, invoiceCurrency, invoiceVendorId }) => (
  <IfPermission perm="invoice.invoice-lines.item.post">
    <div className={styles.invoiceLinesActions}>
      <AddInvoiceLinesActionContainer
        addLines={addLines}
        invoiceCurrency={invoiceCurrency}
        invoiceVendorId={invoiceVendorId}
        isDisabled={isDisabled}
      />

      <Button
        data-test-button-create-line
        onClick={createLine}
        disabled={isDisabled}
      >
        <FormattedMessage id="ui-invoice.button.createLine" />
      </Button>
    </div>
  </IfPermission>
);

InvoiceLinesActions.propTypes = {
  addLines: PropTypes.func.isRequired,
  createLine: PropTypes.func.isRequired,
  invoiceCurrency: PropTypes.string.isRequired,
  invoiceVendorId: PropTypes.string.isRequired,
  isDisabled: PropTypes.bool,
};

InvoiceLinesActions.defaultProps = {
  isDisabled: false,
};

export default InvoiceLinesActions;
