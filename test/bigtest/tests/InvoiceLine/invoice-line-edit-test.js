import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../helpers/setup-application';
import InvoiceLineFormInteractor from '../../interactors/InvoiceLineFormInteractor';

describe('Invoice line edit', () => {
  setupApplication();

  const invoiceLineForm = new InvoiceLineFormInteractor();

  beforeEach(async function () {
    const vendor = this.server.create('vendor');
    const invoice = this.server.create('invoice', {
      vendorId: vendor.id,
    });
    const invoiceLine = this.server.create('line', {
      invoiceId: invoice.id,
    });

    this.visit(`/invoice/view/${invoice.id}/line/${invoiceLine.id}/edit`);
    await invoiceLineForm.whenLoaded();
  });

  it('displays an edit invoice line form', () => {
    expect(invoiceLineForm.isLoaded).to.be.true;
  });

  describe('Add data and save invoice line', () => {
    beforeEach(async function () {
      await invoiceLineForm.description.fill('new test value');
      await invoiceLineForm.buttonSave.click();
    });

    it('closes edit invoice line form', () => {
      expect(invoiceLineForm.isPresent).to.be.false;
    });
  });
});
