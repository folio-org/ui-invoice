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
  isApprovePayEnabled,
  isDeleteDisabled,
  isEditDisabled,
  onApprove,
  onApproveAndPay,
  onDelete,
  onEdit,
  onPay,
  onPrint,
}) => {
  const isDeletable = !(isPayable(invoice.status) || isPaid(invoice.status));

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
        !isApprovePayEnabled && invoiceLinesCount > 0 && isPayable(invoice.status) && (
          <IfPermission perm="invoice.item.pay">
            <Button
              data-testid="invoice-pay"
              data-test-invoice-action-pay
              buttonStyle="dropdownItem"
              onClick={onPay}
            >
              <FormattedMessage id="ui-invoice.invoice.actions.pay" />
            </Button>
          </IfPermission>
        )
      }
      {
        !isApprovePayEnabled && invoiceLinesCount > 0 && !IS_EDIT_POST_APPROVAL(invoice.id, invoice.status) && (
          <IfPermission perm="invoice.item.approve">
            <Button
              data-testid="invoice-approve"
              data-test-invoice-action-approve
              buttonStyle="dropdownItem"
              onClick={onApprove}
            >
              <FormattedMessage id="ui-invoice.invoice.actions.approve" />
            </Button>
          </IfPermission>
        )
      }
      {
        isApprovePayEnabled
        && invoiceLinesCount > 0
        && (!IS_EDIT_POST_APPROVAL(invoice.id, invoice.status) || isPayable(invoice.status))
        && (
          <IfPermission perm="invoice.item.approve,invoice.item.pay">
            <Button
              data-testid="invoice-approve-pay"
              data-test-invoice-action-approve
              buttonStyle="dropdownItem"
              onClick={onApproveAndPay}
            >
              <FormattedMessage id="ui-invoice.invoice.actions.approveAndPay" />
            </Button>
          </IfPermission>
        )
      }
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
    </MenuSection>
  );
};

InvoiceActions.propTypes = {
  invoice: PropTypes.object.isRequired,
  invoiceLinesCount: PropTypes.number,
  isApprovePayEnabled: PropTypes.bool,
  isDeleteDisabled: PropTypes.bool.isRequired,
  isEditDisabled: PropTypes.bool.isRequired,
  onApprove: PropTypes.func.isRequired,
  onApproveAndPay: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onPay: PropTypes.func.isRequired,
  onPrint: PropTypes.func,
};

InvoiceActions.defaultProps = {
  invoiceLinesCount: 0,
  isApprovePayEnabled: false,
};

export default InvoiceActions;
