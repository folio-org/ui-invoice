import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../helpers/setup-application';
import InvoiceLineFormInteractor from '../../interactors/InvoiceLineFormInteractor';
import {
  InvoiceDetailsInteractor,
  InvoiceLineDetailsInteractor,
} from '../../interactors';
import { ADJUSTMENT_RELATION_TO_TOTAL_VALUES } from '../../../../src/common/constants';

const ACCOUNT_NUMBER = 'some-number';
const ACCOUNTING_CODE = 'some-code';

describe('Invoice line edit', () => {
  setupApplication();

  const invoiceLineForm = new InvoiceLineFormInteractor();
  const invoiceDetails = new InvoiceDetailsInteractor();
  const invoiceLineDetails = new InvoiceLineDetailsInteractor();

  beforeEach(async function () {
    const fund = this.server.create('fund');
    const vendor = this.server.create('vendor', {
      accounts: [{
        accountNo: ACCOUNT_NUMBER,
        appSystemNo: ACCOUNTING_CODE,
      }],
    });
    const invoice = this.server.create('invoice', {
      vendorId: vendor.id,
    });
    const invoiceLine = this.server.create('line', {
      invoiceId: invoice.id,
      accountNumber: ACCOUNT_NUMBER,
      accountingCode: ACCOUNTING_CODE,
      fundDistributions: [{
        fundId: fund.id,
        value: 100,
      }],
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
      await invoiceLineForm.accountNumberButton.click();
      await invoiceLineForm.accountNumberOptions.list(0).click();
      await invoiceLineForm.adjustmentsForm.addButton.click();
      await invoiceLineForm.adjustmentsForm.addButton.click();
      await invoiceLineForm.adjustmentsForm.removeButtons(1).click();
      await invoiceLineForm.adjustmentsForm.descriptionInputs(0).fill('test description');
      await invoiceLineForm.adjustmentsForm.amountInputs(0).fill('1.11');
      await invoiceLineForm.adjustmentsForm.relationToTotalInputs(0)
        .selectAndBlur(ADJUSTMENT_RELATION_TO_TOTAL_VALUES.separateFrom);
      await invoiceLineForm.buttonSave.click();
    });

    it('closes edit invoice line form', () => {
      expect(invoiceLineForm.isPresent).to.be.false;
      expect(invoiceDetails.isPresent).to.be.true;
    });

    describe('click on edited line', () => {
      beforeEach(async function () {
        await invoiceDetails.linesSection.list(0).click();
      });

      it('displays added adjustments', () => {
        expect(invoiceLineDetails.isPresent).to.be.true;
        expect(invoiceLineDetails.adjustments.list(0).rowText).to.include('test description');
      });
    });
  });
});
