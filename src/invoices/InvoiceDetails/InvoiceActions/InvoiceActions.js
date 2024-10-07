import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { IfPermission } from '@folio/stripes/core';
import {
  Button,
  Icon,
  MenuSection,
} from '@folio/stripes/components';

import {
  isPayable,
  isPaid,
  IS_EDIT_POST_APPROVAL,
} from '../../../common/utils';

const InvoiceActions = ({
  invoice,
  invoiceLinesCount,
  isApprovePayAvailable,
  isDeleteDisabled,
  isEditDisabled,
  onApprove,
  onApproveAndPay,
  onDelete,
  onDuplicate,
  onEdit,
  onPay,
  onPrint,
  onInvoiceCancel,
  isApprovePayEnabled,
}) => {
  const isDeletable = !(isPayable(invoice.status) || isPaid(invoice.status));
  const isCancelable = isPayable(invoice.status) || isPaid(invoice.status);

  return (
    <MenuSection id="invoice-details-actions">
      <IfPermission perm="invoice.invoices.item.put">
        <Button
          buttonStyle="dropdownItem"
          data-testid="invoice-edit"
          data-test-button-edit-invoice
          disabled={isEditDisabled}
          onClick={onEdit}
        >
          <Icon size="small" icon="edit">
            <FormattedMessage id="ui-invoice.button.edit" />
          </Icon>
        </Button>
      </IfPermission>
      {
        !isApprovePayAvailable && invoiceLinesCount > 0 && isPayable(invoice.status) && (
          <IfPermission perm="invoice.item.pay.execute">
            <Button
              data-testid="invoice-pay"
              data-test-invoice-action-pay
              buttonStyle="dropdownItem"
              onClick={onPay}
              disabled={!isApprovePayEnabled}
            >
              <Icon size="small" icon="cart">
                <FormattedMessage id="ui-invoice.invoice.actions.pay" />
              </Icon>
            </Button>
          </IfPermission>
        )
      }
      {
        !isApprovePayAvailable && invoiceLinesCount > 0 && !IS_EDIT_POST_APPROVAL(invoice.id, invoice.status) && (
          <IfPermission perm="invoice.item.approve.execute">
            <Button
              data-testid="invoice-approve"
              data-test-invoice-action-approve
              buttonStyle="dropdownItem"
              onClick={onApprove}
              disabled={!isApprovePayEnabled}
            >
              <Icon size="small" icon="check-circle">
                <FormattedMessage id="ui-invoice.invoice.actions.approve" />
              </Icon>
            </Button>
          </IfPermission>
        )
      }
      {
        isApprovePayAvailable
        && invoiceLinesCount > 0
        && (!IS_EDIT_POST_APPROVAL(invoice.id, invoice.status) || isPayable(invoice.status))
        && (
          <IfPermission perm="invoice.item.approve.execute,invoice.item.pay.execute">
            <Button
              data-testid="invoice-approve-pay"
              data-test-invoice-action-approve
              buttonStyle="dropdownItem"
              onClick={onApproveAndPay}
              disabled={!isApprovePayEnabled}
            >
              <Icon size="small" icon="cart">
                <FormattedMessage id="ui-invoice.invoice.actions.approveAndPay" />
              </Icon>
            </Button>
          </IfPermission>
        )
      }
      <IfPermission perm="invoice.invoices.item.post">
        <Button
          buttonStyle="dropdownItem"
          data-testid="invoice-duplicate"
          data-test-button-duplicate-invoice
          onClick={onDuplicate}
        >
          <Icon size="small" icon="duplicate">
            <FormattedMessage id="ui-invoice.button.duplicate" />
          </Icon>
        </Button>
      </IfPermission>
      {
        isDeletable && (
          <IfPermission perm="invoice.invoices.item.delete">
            <Button
              buttonStyle="dropdownItem"
              data-test-button-delete-invoice
              disabled={isDeleteDisabled}
              onClick={onDelete}
            >
              <Icon size="small" icon="trash">
                <FormattedMessage id="ui-invoice.button.delete" />
              </Icon>
            </Button>
          </IfPermission>
        )
      }
      {onPrint && (
        <Button
          data-testid="invoice-print"
          buttonStyle="dropdownItem"
          onClick={onPrint}
        >
          <Icon size="small" icon="print">
            <FormattedMessage id="ui-invoice.invoice.actions.print" />
          </Icon>
        </Button>
      )}
      {isCancelable && (
        <IfPermission perm="invoice.item.cancel.execute">
          <Button
            buttonStyle="dropdownItem"
            onClick={onInvoiceCancel}
          >
            <Icon size="small" icon="times-circle">
              <FormattedMessage id="ui-invoice.button.cancel" />
            </Icon>
          </Button>
        </IfPermission>
      )}
    </MenuSection>
  );
};

InvoiceActions.propTypes = {
  invoice: PropTypes.object.isRequired,
  invoiceLinesCount: PropTypes.number,
  isApprovePayAvailable: PropTypes.bool,
  isApprovePayEnabled: PropTypes.bool,
  isDeleteDisabled: PropTypes.bool.isRequired,
  isEditDisabled: PropTypes.bool.isRequired,
  onApprove: PropTypes.func.isRequired,
  onApproveAndPay: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onDuplicate: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onPay: PropTypes.func.isRequired,
  onInvoiceCancel: PropTypes.func.isRequired,
  onPrint: PropTypes.func,
};

InvoiceActions.defaultProps = {
  invoiceLinesCount: 0,
  isApprovePayAvailable: false,
};

export default InvoiceActions;
