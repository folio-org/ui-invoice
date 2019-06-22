import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../helpers/setup-application';
import InvoiceDetails from '../../interactors/InvoiceDetails';
import InvoiceLineFormInteractor from '../../interactors/InvoiceLineFormInteractor';

describe('Invoice details', () => {
  setupApplication();

  const invoiceDetails = new InvoiceDetails();
  const invoiceLineForm = new InvoiceLineFormInteractor();

  beforeEach(async function () {
    const invoice = this.server.create('invoice');

    this.visit(`/invoice/view/${invoice.id}`);
    await invoiceDetails.whenLoaded();
  });

  it('should be displayed', () => {
    expect(invoiceDetails.isPresent).to.be.true;
  });

  describe('Click on create line button', () => {
    beforeEach(async function () {
      await invoiceDetails.buttonCreateLine.click();
      await invoiceLineForm.whenLoaded();
    });

    it('shows invoice line form', () => {
      expect(invoiceLineForm.isPresent).to.be.true;
    });
  });
});
