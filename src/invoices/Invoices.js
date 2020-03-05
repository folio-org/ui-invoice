import React from 'react';
import {
  Switch,
  Route,
} from 'react-router-dom';

import { InvoicesListContainer } from './InvoicesList';
import { CreateInvoice } from './CreateInvoice';
import { EditInvoice } from './EditInvoice';
import { CreateInvoiceLine } from './CreateInvoiceLine';
import { EditInvoiceLine } from './EditInvoiceLine';
import { Voucher } from './Voucher';

const Invoices = () => {
  return (
    <Switch>
      <Route
        path="/invoice/edit/:id"
        component={EditInvoice}
      />
      <Route
        path="/invoice/create"
        component={CreateInvoice}
      />
      <Route
        path="/invoice/view/:id/line/:lineId/edit"
        component={EditInvoiceLine}
      />
      <Route
        path="/invoice/view/:id/line/create"
        component={CreateInvoiceLine}
      />
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
