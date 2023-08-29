import { MemoryRouter } from 'react-router-dom';

import { render } from '@folio/jest-config-stripes/testing-library/react';

import DuplicateInvoiceList from './DuplicateInvoiceList';

const INVOICE_LIST = [{
  currency: 'USD',
  vendorInvoiceNo: '10000',
  id: 'fba9f008-29e3-42be-b589-2cc7daf9486c',
  invoiceDate: '2020-12-17T00:00:00.000+0000',
  status: 'Approved',
  total: 1,
  vendorId: '11fb627a-cdf1-11e8-a8d5-f2801f1b9fd1',
  vendor: { id: '11fb627a-cdf1-11e8-a8d5-f2801f1b9fd1', name: 'Vendor' },
}];

const renderDuplicateInvoiceList = (invoices) => (render(
  <MemoryRouter>
    <DuplicateInvoiceList
      invoices={invoices}
    />
  </MemoryRouter>,
));

describe('DuplicateInvoiceList component', () => {
  it('should display duplicate invoice list title', () => {
    const { getByText } = renderDuplicateInvoiceList(INVOICE_LIST);

    expect(getByText('ui-invoice.invoice.duplicateInvoice.title')).toBeDefined();
  });

  it('should display invoice in the list', () => {
    const { getByText } = renderDuplicateInvoiceList(INVOICE_LIST);

    expect(getByText('10000')).toBeDefined();
    expect(getByText('ui-invoice.invoice.status.approved')).toBeDefined();
    expect(getByText('Vendor')).toBeDefined();
  });
});
