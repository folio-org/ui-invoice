import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { PAYMENT_METHOD } from '@folio/stripes-acq-components';

import setupApplication from '../../helpers/setup-application';
import InvoiceFormInteractor from '../../interactors/InvoiceFormInteractor';
import InvoicesListInteractor from '../../interactors/InvoicesList';

describe('Invoice create', () => {
  setupApplication();

  const invoiceForm = new InvoiceFormInteractor();

  beforeEach(async function () {
    this.server.createList('vendor', 2);
    this.visit('/invoice?layer=create');
    await invoiceForm.whenLoaded();
  });

  it('displays an create invoice form', () => {
    expect(invoiceForm.isPresent).to.be.true;
  });

  describe('Add data and save invoice', () => {
    beforeEach(async function () {
      await invoiceForm.termsInput.fill('test value');
      await invoiceForm.formFooter.saveButton.click();
    });

    it('closes edit form', () => {
      expect(invoiceForm.isPresent).to.be.true;
    });

    describe('Add all required data and save invoice', () => {
      const invoicesList = new InvoicesListInteractor();

      beforeEach(async function () {
        await invoiceForm.vendorInvoiceNo.fill('vendorInvoiceNo');
        await invoiceForm.invoiceDate.fill('2019-01-01').blur();
        await invoiceForm.approvalDate.fill('2019-01-02').blur();
        await invoiceForm.paymentMethod.select(PAYMENT_METHOD.cash);
        await invoiceForm.status.options.list(1).click();
        await invoiceForm.vendorButton.click();
        await invoiceForm.vendor.options.list(1).click();
        await invoiceForm.formFooter.saveButton.click();
        await invoicesList.whenLoaded();
      });

      it('closes edit form, goes to the list', () => {
        expect(invoicesList.isPresent).to.be.true;
      });
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
