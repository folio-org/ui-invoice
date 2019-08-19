import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../helpers/setup-application';
import InvoiceFormInteractor from '../../interactors/InvoiceFormInteractor';
import InvoicesListInteractor from '../../interactors/InvoicesList';

describe('Invoice create with documents', () => {
  setupApplication();

  const invoiceForm = new InvoiceFormInteractor();
  const invoicesList = new InvoicesListInteractor();

  beforeEach(async function () {
    this.server.createList('vendor', 2);
    this.visit('/invoice?layer=create');

    await invoiceForm.whenLoaded();

    await invoiceForm.termsInput.fill('test value');
    await invoiceForm.vendorInvoiceNo.fill('vendorInvoiceNo');
    await invoiceForm.invoiceDate.fill('2019-01-01').blur();
    await invoiceForm.approvalDate.fill('2019-01-02').blur();
    await invoiceForm.paymentMethod.options.list(1).click();
    await invoiceForm.status.options.list(1).click();
    await invoiceForm.vendorButton.click();
    await invoiceForm.vendor.options.list(1).click();

    await invoiceForm.documentsAndLinks.addLinkButton.click();
    await invoiceForm.documentsAndLinks.links(0).fillName('test link');
    await invoiceForm.documentsAndLinks.links(0).fillUrl('test url');

    await invoiceForm.saveButton.click();

    await invoicesList.whenLoaded();
  });

  it('should close form', () => {
    expect(invoiceForm.isPresent).to.be.false;
  });

  it('should open invoice list', () => {
    expect(invoicesList.isPresent).to.be.true;
  });
});
