import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import {
  Button,
  Icon,
  MenuSection,
} from '@folio/stripes/components';
import { IfPermission } from '@folio/stripes/core';

const ActionMenu = ({ onDelete, onEdit, isDeletable }) => (
  <MenuSection id="invoice-line-details-actions">
    <IfPermission perm="invoice.invoice-lines.item.put">
      <Button
        data-testid="invoice-line-edit"
        buttonStyle="dropdownItem"
        data-test-button-edit-invoice-line
        onClick={onEdit}
      >
        <Icon size="small" icon="edit">
          <FormattedMessage id="ui-invoice.button.edit" />
        </Icon>
      </Button>
    </IfPermission>
    {isDeletable && (
      <IfPermission perm="invoice.invoice-lines.item.delete">
        <Button
          data-testid="invoice-line-delete"
          buttonStyle="dropdownItem"
          data-test-button-delete-invoice-line
          onClick={onDelete}
        >
          <Icon size="small" icon="trash">
            <FormattedMessage id="ui-invoice.button.delete" />
          </Icon>
        </Button>
      </IfPermission>
    )}
  </MenuSection>
);

ActionMenu.propTypes = {
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  isDeletable: PropTypes.bool.isRequired,
};

export default ActionMenu;
