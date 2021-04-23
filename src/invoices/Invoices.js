import React from 'react';
import {
  Switch,
  Route,
} from 'react-router-dom';

import {
  checkScope,
  CommandList,
  defaultKeyboardShortcuts,
  HasCommand,
} from '@folio/stripes/components';
import { PermissionedRoute } from '@folio/stripes-acq-components';

import {
  RETURN_LINK,
  RETURN_LINK_LABEL_ID,
} from '../common/constants';
import { InvoicesListContainer } from './InvoicesList';
import { CreateInvoice } from './CreateInvoice';
import { EditInvoice } from './EditInvoice';
import { CreateInvoiceLine } from './CreateInvoiceLine';
import { EditInvoiceLine } from './EditInvoiceLine';
import { Voucher } from './Voucher';

const Invoices = () => {
  const focusSearchField = () => {
    const el = document.getElementById('input-record-search');

    if (el) {
      el.focus();
    }
  };

  const shortcuts = [
    {
      name: 'search',
      handler: focusSearchField,
    },
  ];

  return (
    <CommandList commands={defaultKeyboardShortcuts}>
      <HasCommand
        commands={shortcuts}
        isWithinScope={checkScope}
        scope={document.body}
      >
        <Switch>
          <PermissionedRoute
            path="/invoice/edit/:id"
            perm="ui-invoice.invoice.edit"
            returnLink={RETURN_LINK}
            returnLinkLabelId={RETURN_LINK_LABEL_ID}
          >
            <EditInvoice />
          </PermissionedRoute>
          <PermissionedRoute
            path="/invoice/create"
            perm="ui-invoice.invoice.edit"
            returnLink={RETURN_LINK}
            returnLinkLabelId={RETURN_LINK_LABEL_ID}
          >
            <CreateInvoice />
          </PermissionedRoute>
          <PermissionedRoute
            path="/invoice/view/:id/line/:lineId/edit"
            perm="ui-invoice.invoice.edit"
            returnLink={RETURN_LINK}
            returnLinkLabelId={RETURN_LINK_LABEL_ID}
          >
            <EditInvoiceLine />
          </PermissionedRoute>
          <PermissionedRoute
            path="/invoice/view/:id/line/create"
            perm="ui-invoice.invoice.edit"
            returnLink={RETURN_LINK}
            returnLinkLabelId={RETURN_LINK_LABEL_ID}
          >
            <CreateInvoiceLine />
          </PermissionedRoute>
          <Route
            path="/invoice/view/:id/voucher/"
            component={Voucher}
          />
          <Route
            path="/invoice"
            component={InvoicesListContainer}
          />
        </Switch>
      </HasCommand>
    </CommandList>
  );
};

export default Invoices;
