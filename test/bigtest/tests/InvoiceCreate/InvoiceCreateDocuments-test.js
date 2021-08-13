import {
  beforeEach,
  describe,
  // it,
} from '@bigtest/mocha';
// import { expect } from 'chai';

import { PAYMENT_METHOD } from '@folio/stripes-acq-components';

import setupApplication from '../../helpers/setup-application';
import InvoiceFormInteractor from '../../interactors/InvoiceFormInteractor';
import InvoiceDetails from '../../interactors/InvoiceDetails';

describe('Invoice create with documents', function () {
  setupApplication();

  this.timeout(10000);

  const invoiceForm = new InvoiceFormInteractor();
  const invoiceDetails = new InvoiceDetails();

  beforeEach(async function () {
    this.server.createList('vendor', 2);
    this.server.create('batchgroup');
    this.visit('/invoice/create');

    await invoiceForm.whenLoaded();

    await invoiceForm.termsInput.fill('test value');
    await invoiceForm.vendorInvoiceNo.fill('vendorInvoiceNo');
    await invoiceForm.invoiceDate.fill('2019-01-01').blur();
    await invoiceForm.approvalDate.fill('2019-01-02').blur();
    await invoiceForm.paymentMethod.select(PAYMENT_METHOD.cash);
    await invoiceForm.status.options.list(1).click();
    await invoiceForm.vendorField.fill('Amazon');

    await invoiceForm.documentsAndLinks.addLinkButton.click();
    await invoiceForm.documentsAndLinks.links(0).fillName('test link');
    await invoiceForm.documentsAndLinks.links(0).fillUrl('test url');

    await invoiceForm.formFooter.saveButton.click();
    await invoiceForm.whenDestroyed();

    await invoiceDetails.whenLoaded();
  });

  // it('should close form', () => {
  //   expect(invoiceForm.isPresent).to.be.false;
  // });

  // it('should open invoice details', () => {
  //   expect(invoiceDetails.isPresent).to.be.true;
  // });
});
