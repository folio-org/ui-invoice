import React from 'react';
import {
  Switch,
  Route,
} from 'react-router-dom';

import { Callout } from '@folio/stripes/components';
import { ToastContext } from '@folio/stripes-acq-components';

import { InvoicesListContainer } from './InvoicesList';
import { CreateInvoice } from './CreateInvoice';
import { EditInvoice } from './EditInvoice';
import { CreateInvoiceLine } from './CreateInvoiceLine';
import { EditInvoiceLine } from './EditInvoiceLine';
import { Voucher } from './Voucher';

const callout = React.createRef();

const Invoices = () => {
  return (
    <>
      <ToastContext.Provider value={callout}>
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
      </ToastContext.Provider>
      <Callout ref={callout} />
    </>
  );
};

export default Invoices;
