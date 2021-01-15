import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../helpers/setup-application';
import InvoiceLineFormInteractor from '../../interactors/InvoiceLineFormInteractor';
import InvoiceDetails from '../../interactors/InvoiceDetails';

const ACCOUNT_NUMBER = 'some-number';
const ACCOUNTING_CODE = 'some-code';

describe('Invoice line create', function () {
  setupApplication();
  this.timeout(15000);

  const invoiceLineForm = new InvoiceLineFormInteractor();
  const invoiceDetails = new InvoiceDetails();

  beforeEach(async function () {
    const vendor = this.server.create('vendor', {
      accounts: [{
        accountNo: ACCOUNT_NUMBER,
        appSystemNo: ACCOUNTING_CODE,
      }],
    });
    const invoice = this.server.create('invoice', {
      vendorId: vendor.id,
    });

    this.visit(`/invoice/view/${invoice.id}/line/create`);
    await invoiceLineForm.whenLoaded();
  });

  it('displays an create invoice line form', () => {
    expect(invoiceLineForm.isPresent).to.be.true;
  });

  describe('Add data and save invoice line', () => {
    beforeEach(async function () {
      await invoiceLineForm.description.fill('test value');
      await invoiceLineForm.accountNumberButton.click();
      await invoiceLineForm.accountNumberOptions.list(1).click();
      await invoiceLineForm.formFooter.saveButton.click();
    });

    it('shows edit line form, since required fields are missing', () => {
      expect(invoiceLineForm.isPresent).to.be.true;
    });

    describe('Fill all required fields and save invoice line', () => {
      beforeEach(async function () {
        await invoiceLineForm.quantity.fill('2');
        await invoiceLineForm.subTotal.fill('300');
        await invoiceLineForm.formFooter.saveButton.click();
        await invoiceDetails.whenLoaded();
      });

      it('closes edit line form and shows Invoice details', () => {
        expect(invoiceDetails.isPresent).to.be.true;
      });
    });
  });
});
