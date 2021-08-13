import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../helpers/setup-application';
import InvoicesListInteractor from '../../interactors/InvoicesList';
import InvoiceFormInteractor from '../../interactors/InvoiceFormInteractor';

const INVOICES_COUNT = 15;

describe('Invoices list', function () {
  setupApplication();

  this.timeout(10000);

  const invoicesList = new InvoicesListInteractor();

  beforeEach(async function () {
    const invoices = this.server.createList('invoice', INVOICES_COUNT);

    invoices.forEach(invoice => this.server.create('vendor', {
      id: invoice.vendorId,
    }));

    this.visit('/invoice');
    await invoicesList.whenLoaded();
  });

  it('shows the list of invoice items', () => {
    expect(invoicesList.isPresent).to.equal(true);
  });

  it('renders row for each invoice from the response', () => {
    expect(invoicesList.invoices().length).to.be.equal(INVOICES_COUNT);
  });

  it('displays create the new invoice button', () => {
    expect(invoicesList.newInvoiceButton.isPresent).to.be.true;
  });

  describe('Create new invoice', () => {
    const invoiceForm = new InvoiceFormInteractor();

    beforeEach(async function () {
      await invoicesList.newInvoiceButton.click();
      await invoiceForm.whenLoaded();
    });

    it('displays create invoice form', () => {
      expect(invoiceForm.isVisible).to.be.true;
    });
  });
});
