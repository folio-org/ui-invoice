import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../helpers/setup-application';
import InvoiceFormInteractor from '../../interactors/InvoiceFormInteractor';
import InvoicesListInteractor from '../../interactors/InvoicesList';

const TEST_VALUE_PAYMENT_TERMS = 'some test value';

describe('Invoice edit documents', () => {
  setupApplication();

  const invoiceForm = new InvoiceFormInteractor();

  beforeEach(async function () {
    const vendor = this.server.create('vendor');
    const invoice = this.server.create('invoice', {
      paymentTerms: TEST_VALUE_PAYMENT_TERMS,
      vendorId: vendor.id,
    });

    this.server.create('document', {
      documentMetadata: {
        name: 'test link',
        invoiceId: invoice.id,
        url: 'test url',
      },
    });

    this.server.create('document', {
      documentMetadata: {
        name: 'test document',
        invoiceId: invoice.id,
      },
      contents: {
        data: 'base 64 data',
      },
    });

    this.visit(`/invoice/view/${invoice.id}?layer=edit`);
    await invoiceForm.whenLoaded();
  });

  it('should display link from BE', () => {
    expect(invoiceForm.documentsAndLinks.links().length).to.be.equal(1);
  });

  it('should display document from BE', () => {
    expect(invoiceForm.documentsAndLinks.documents().length).to.be.equal(1);
  });

  describe('save invoice with removed documents', () => {
    const invoicesList = new InvoicesListInteractor();

    beforeEach(async function () {
      await invoiceForm.documentsAndLinks.links(0).removeButton.click();
      await invoiceForm.documentsAndLinks.documents(0).removeButton.click();

      await invoiceForm.formFooter.saveButton.click();

      await invoicesList.whenLoaded();
    });

    it('should close edit form', () => {
      expect(invoiceForm.isPresent).to.be.false;
    });

    it('should open invoice list', () => {
      expect(invoicesList.isPresent).to.be.true;
    });
  });
});
