import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import {
  Button,
  Icon,
  MenuSection,
} from '@folio/stripes/components';
import { IfPermission } from '@folio/stripes/core';

const ActionMenu = ({ onDelete, onEdit }) => (
  <MenuSection id="invoice-line-details-actions">
    <IfPermission perm="invoice.invoice-lines.item.delete">
      <Button
        buttonStyle="dropdownItem"
        data-test-button-delete-invoice-line
        onClick={onDelete}
      >
        <Icon size="small" icon="trash">
          <FormattedMessage id="ui-invoice.button.delete" />
        </Icon>
      </Button>
    </IfPermission>
    <IfPermission perm="invoice.invoice-lines.item.put">
      <Button
        buttonStyle="dropdownItem"
        data-test-button-edit-invoice-line
        onClick={onEdit}
      >
        <Icon size="small" icon="edit">
          <FormattedMessage id="ui-invoice.button.edit" />
        </Icon>
      </Button>
    </IfPermission>
  </MenuSection>
);

ActionMenu.propTypes = {
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
};

export default ActionMenu;
