import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../helpers/setup-application';
import InvoiceFormInteractor from '../../interactors/InvoiceFormInteractor';
import InvoicesListInteractor from '../../interactors/InvoicesList';

describe('Invoice create', () => {
  setupApplication();

  const invoiceForm = new InvoiceFormInteractor();

  beforeEach(async function () {
    this.visit('/invoice?layer=create');
    await invoiceForm.whenLoaded();
  });

  it('displays an create invoice form', () => {
    expect(invoiceForm.isPresent).to.be.true;
  });

  describe('Add data and save invoice', () => {
    const invoicesList = new InvoicesListInteractor();

    beforeEach(async function () {
      await invoiceForm.termsInput.fill('test value');
      await invoiceForm.saveButton.click();
      await invoicesList.whenLoaded();
    });

    it('closes edit form', () => {
      expect(invoiceForm.isPresent).to.be.false;
    });
  });

  describe('Invoice information accordion could be collapsed', () => {
    beforeEach(async function () {
      await invoiceForm.invoiceInformation.click();
    });

    it('displays the form', () => {
      expect(invoiceForm.isPresent).to.be.true;
    });
  });
});
