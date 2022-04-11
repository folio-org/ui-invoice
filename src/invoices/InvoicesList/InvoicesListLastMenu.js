import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

import {
  Button,
  Icon,
  MenuSection,
} from '@folio/stripes/components';
import { IfPermission } from '@folio/stripes/core';

export const InvoicesListLastMenu = ({ onToggle, invoicesCount, toggleExportModal }) => {
  const intl = useIntl();
  const location = useLocation();

  return (
    <MenuSection id="invoice-list-actions">
      <IfPermission perm="invoice.invoices.item.post">
        <Button
          id="clickable-new-invoice"
          buttonStyle="dropdownItem"
          aria-label={intl.formatMessage({ id: 'stripes-smart-components.addNew' })}
          to={{
            pathname: '/invoice/create',
            search: location.search,
          }}
        >
          <Icon size="small" icon="plus-sign">
            <FormattedMessage id="stripes-smart-components.new" />
          </Icon>
        </Button>
      </IfPermission>

      <IfPermission perm="ui-invoice.voucherExport">
        <Button
          id="clickable-voucher-export"
          buttonStyle="dropdownItem"
          aria-label={intl.formatMessage({ id: 'ui-invoice.button.voucherExport' })}
          to={{
            pathname: '/invoice/voucher-export',
            search: location.search,
          }}
        >
          <Icon size="small" icon="download">
            <FormattedMessage id="ui-invoice.button.voucherExport" />
          </Icon>
        </Button>
      </IfPermission>

      <IfPermission perm="ui-invoice.exportCSV">
        <Button
          data-testid="export-csv-button"
          id="clickable-export-csv"
          buttonStyle="dropdownItem"
          aria-label={intl.formatMessage({ id: 'ui-invoice.button.exportCSV' })}
          onClick={() => {
            onToggle();
            toggleExportModal();
          }}
          disabled={!invoicesCount}
        >
          <Icon size="small" icon="download">
            <FormattedMessage id="ui-invoice.button.exportCSV" />
          </Icon>
        </Button>
      </IfPermission>
    </MenuSection>
  );
};

InvoicesListLastMenu.propTypes = {
  invoicesCount: PropTypes.number.isRequired,
  onToggle: PropTypes.func.isRequired,
  toggleExportModal: PropTypes.func.isRequired,
};
