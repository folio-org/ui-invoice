import React from 'react';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';

import {
  PaneMenu,
  Button,
} from '@folio/stripes/components';
import { IfPermission } from '@folio/stripes/core';

const InvoicesListLastMenu = ({ location }) => {
  return (
    <IfPermission perm="invoice.invoices.item.post">
      <PaneMenu>
        <FormattedMessage id="stripes-smart-components.addNew">
          {ariaLabel => (
            <Button
              id="clickable-newInvoice"
              aria-label={ariaLabel}
              to={{
                pathname: '/invoice/create',
                search: location.search,
              }}
              buttonStyle="primary"
              marginBottom0
            >
              <FormattedMessage id="stripes-smart-components.new" />
            </Button>
          )}
        </FormattedMessage>
      </PaneMenu>
    </IfPermission>
  );
};

InvoicesListLastMenu.propTypes = {
  location: ReactRouterPropTypes.location.isRequired,
};

export default withRouter(InvoicesListLastMenu);
