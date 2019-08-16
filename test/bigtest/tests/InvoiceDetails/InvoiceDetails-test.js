import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../helpers/setup-application';
import InvoiceDetails from '../../interactors/InvoiceDetails';
import InvoiceLineFormInteractor from '../../interactors/InvoiceLineFormInteractor';
import ConfirmationInteractor from '../../interactors/ConfirmationInteractor';

describe('Invoice details', () => {
  setupApplication();

  const invoiceDetails = new InvoiceDetails();
  const invoiceLineForm = new InvoiceLineFormInteractor();

  beforeEach(async function () {
    const user = this.server.create('user', {
      personal: {
        firstName: 'Diku',
        lastName: 'Admin',
      },
    });
    const invoice = this.server.create('invoice', {
      approvedBy: user.id,
    });

    this.server.create('vendor', {
      id: invoice.vendorId,
    });

    this.visit(`/invoice/view/${invoice.id}`);
    await invoiceDetails.whenLoaded();
  });

  it('should be displayed', () => {
    expect(invoiceDetails.isPresent).to.be.true;
    expect(invoiceDetails.approvedBy.value).to.include('Admin, Diku');
  });

  it('voucher information accordion is not presented', () => {
    expect(invoiceDetails.voucherAccordion).to.be.false;
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

  describe('click delete invoice and confirm', () => {
    const deleteConfirmation = new ConfirmationInteractor('#delete-invoice-confirmation');

    beforeEach(async function () {
      await invoiceDetails.header.click();
      await invoiceDetails.actions.deleteLine.click();
      await deleteConfirmation.confirm();
    });

    it('closes delete invoice confirmation', () => {
      expect(deleteConfirmation.isPresent).to.be.false;
    });

    it('closes Invoice line details pane', () => {
      expect(invoiceDetails.isPresent).to.be.false;
    });
  });
});
