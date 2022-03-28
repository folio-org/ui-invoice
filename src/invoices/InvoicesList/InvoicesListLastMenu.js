import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { withRouter } from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';

import {
  Button,
  Icon,
  MenuSection,
} from '@folio/stripes/components';
import { IfPermission } from '@folio/stripes/core';

export const InvoicesListLastMenuComponent = ({ location }) => {
  const intl = useIntl();

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
    </MenuSection>
  );
};

InvoicesListLastMenuComponent.propTypes = {
  location: ReactRouterPropTypes.location.isRequired,
};

export default withRouter(InvoicesListLastMenuComponent);
