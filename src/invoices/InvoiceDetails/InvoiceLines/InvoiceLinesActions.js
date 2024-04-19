import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  Dropdown,
  DropdownMenu,
  Icon,
} from '@folio/stripes/components';
import { IfPermission } from '@folio/stripes/core';
import { ColumnManagerMenu } from '@folio/stripes/smart-components';
import { useToggle } from '@folio/stripes-acq-components';

import { INVOICE_LINES_COLUMN_MAPPING } from '../../constants';
import AddInvoiceLinesActionContainer from './AddInvoiceLinesActionContainer';

const InvoiceLinesActions = ({
  addLines,
  createLine,
  isDisabled,
  invoiceCurrency,
  invoiceVendorId,
  toggleColumn,
  visibleColumns,
}) => {
  const [isAddInvoiceLines, toggleAddInvoiceLines] = useToggle();

  return (
    <>
      {
        isAddInvoiceLines && (
          <AddInvoiceLinesActionContainer
            addLines={addLines}
            onClose={toggleAddInvoiceLines}
            invoiceCurrency={invoiceCurrency}
            invoiceVendorId={invoiceVendorId}
          />
        )
      }

      <Dropdown
        data-testid="invoice-lines-action-dropdown"
        label={<FormattedMessage id="stripes-components.paneMenuActionsToggleLabel" />}
        buttonProps={{ buttonStyle: 'primary' }}
        usePortal={false}
        modifiers={{
          preventOverflow: { boundariesElement: 'scrollParent' },
        }}
      >
        <DropdownMenu>
          <IfPermission perm="invoice.invoice-lines.item.post">
            <Button
              buttonStyle="dropdownItem"
              data-test-button-add-line
              onClick={toggleAddInvoiceLines}
              disabled={isDisabled}
              data-testid="add-invoice-line-btn"
            >
              <Icon size="small" icon="plus-sign">
                <FormattedMessage id="ui-invoice.invoice.details.lines.addFromPOL" />
              </Icon>
            </Button>

            <Button
              buttonStyle="dropdownItem"
              data-test-button-create-line
              onClick={createLine}
              disabled={isDisabled}
              data-testid="create-invoice-line-btn"
            >
              <Icon size="small" icon="plus-sign">
                <FormattedMessage id="ui-invoice.invoice.details.lines.createNew" />
              </Icon>
            </Button>
          </IfPermission>

          <ColumnManagerMenu
            prefix="invoice-lines"
            columnMapping={{
              ...INVOICE_LINES_COLUMN_MAPPING,
              lineNumber: <FormattedMessage id="ui-invoice.invoice.details.lines.list.lineNumber.extended" />,
            }}
            visibleColumns={visibleColumns}
            toggleColumn={toggleColumn}
          />
        </DropdownMenu>
      </Dropdown>
    </>
  );
};

InvoiceLinesActions.propTypes = {
  addLines: PropTypes.func.isRequired,
  createLine: PropTypes.func.isRequired,
  invoiceCurrency: PropTypes.string.isRequired,
  invoiceVendorId: PropTypes.string.isRequired,
  isDisabled: PropTypes.bool,
  toggleColumn: PropTypes.func.isRequired,
  visibleColumns: PropTypes.arrayOf(PropTypes.string),
};

InvoiceLinesActions.defaultProps = {
  isDisabled: false,
};

export default InvoiceLinesActions;
