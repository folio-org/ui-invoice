import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { ConfirmationInteractor } from '@folio/stripes-acq-components/test/bigtest/interactors';

import setupApplication from '../../helpers/setup-application';
import InvoiceLineDetailsInteractor from '../../interactors/InvoiceLineDetailsInteractor';
import InvoiceLineFormInteractor from '../../interactors/InvoiceLineFormInteractor';
import InvoiceDetails from '../../interactors/InvoiceDetails';

describe('Invoice line details', () => {
  setupApplication();

  const invoiceLineDetails = new InvoiceLineDetailsInteractor();
  const invoiceLineForm = new InvoiceLineFormInteractor();
  const invoiceDetails = new InvoiceDetails();

  beforeEach(async function () {
    const vendor = this.server.create('vendor');
    const invoice = this.server.create('invoice', {
      vendorId: vendor.id,
    });
    const invoiceLine = this.server.create('line', {
      invoiceId: invoice.id,
    });

    this.visit(`/invoice/view/${invoice.id}/line/${invoiceLine.id}/view`);
    await invoiceLineDetails.whenLoaded();
  });

  it('should be displayed', () => {
    expect(invoiceLineDetails.isPresent).to.be.true;
  });

  describe('click on header', () => {
    beforeEach(async function () {
      await invoiceLineDetails.header.click();
    });

    it('shows action menu', () => {
      expect(invoiceLineDetails.actions.isPresent).to.be.true;
    });
  });

  describe('Click on close line button', () => {
    beforeEach(async function () {
      await invoiceLineDetails.buttonCloseLine.click();
      await invoiceDetails.whenLoaded();
    });

    it('shows invoice details', () => {
      expect(invoiceDetails.isPresent).to.be.true;
    });
  });

  describe('click delete invoice line', () => {
    const deleteConfirmation = new ConfirmationInteractor('#delete-invoice-line-confirmation');

    beforeEach(async function () {
      await invoiceLineDetails.header.click();
      await invoiceLineDetails.actions.deleteLine.click();
    });

    it('shows delete invoice line confirmation', () => {
      expect(deleteConfirmation.isVisible).to.be.true;
    });
  });

  describe('click delete invoice line and cancel', () => {
    const deleteConfirmation = new ConfirmationInteractor('#delete-invoice-line-confirmation');

    beforeEach(async function () {
      await invoiceLineDetails.header.click();
      await invoiceLineDetails.actions.deleteLine.click();
      await deleteConfirmation.cancel();
    });

    it('closes delete order confirmation', () => {
      expect(deleteConfirmation.isPresent).to.be.false;
    });

    it('shows Invoice line details pane', () => {
      expect(invoiceLineDetails.isVisible).to.be.true;
    });
  });

  describe('click delete invoice line and confirm', () => {
    const deleteConfirmation = new ConfirmationInteractor('#delete-invoice-line-confirmation');

    beforeEach(async function () {
      await invoiceLineDetails.header.click();
      await invoiceLineDetails.actions.deleteLine.click();
      await deleteConfirmation.confirm();
    });

    it('closes delete invoice line confirmation', () => {
      expect(deleteConfirmation.isPresent).to.be.false;
    });

    it('closes Invoice line details pane', () => {
      expect(invoiceLineDetails.isPresent).to.be.false;
    });
  });

  describe('click edit invoice line button in caret dropdown', () => {
    beforeEach(async function () {
      await invoiceLineDetails.header.click();
      await invoiceLineDetails.actions.editLine.click();
    });

    it('goes to Edit invoice line screen', () => {
      expect(invoiceLineForm.isPresent).to.be.true;
    });
  });
});
