import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../helpers/setup-application';
import InvoicesListInteractor from '../../interactors/InvoicesList';

const INVOICES_COUNT = 15;

describe('Invoices list', () => {
  setupApplication();

  const invoicesList = new InvoicesListInteractor();

  beforeEach(function () {
    this.server.createList('invoice', INVOICES_COUNT);

    return this.visit('/invoice', () => {
      expect(invoicesList.$root).to.exist;
    });
  });

  it('shows the list of organization items', () => {
    expect(invoicesList.isPresent).to.equal(true);
  });

  it('renders row for each invoice from the response', () => {
    expect(invoicesList.invocies().length).to.be.equal(INVOICES_COUNT);
  });

  it('displays create the new invoice button', () => {
    expect(invoicesList.hasCreateButton).to.be.true;
  });
});
