import React from 'react';
import {
  Switch,
  Route,
} from 'react-router-dom';

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
  return (
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
  );
};

export default Invoices;
