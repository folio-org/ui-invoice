import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { FUND_DISTR_TYPE } from '@folio/stripes-acq-components';
import { ConfirmationInteractor } from '@folio/stripes-acq-components/test/bigtest/interactors';

import {
  ADJUSTMENT_PRORATE_VALUES,
  ADJUSTMENT_RELATION_TO_TOTAL_VALUES,
  ADJUSTMENT_TYPE_VALUES,
} from '../../../../src/common/constants';
import setupApplication from '../../helpers/setup-application';
import InvoiceFormInteractor from '../../interactors/InvoiceFormInteractor';

const TEST_VALUE_PAYMENT_TERMS = 'some test value';

describe('Invoice edit', () => {
  setupApplication();

  const invoiceForm = new InvoiceFormInteractor();

  beforeEach(async function () {
    const batchGroup = this.server.create('batchgroup');
    const fund = this.server.create('fund');

    fund.fund.id = fund.id;
    const vendor = this.server.create('vendor');
    const invoice = this.server.create('invoice', {
      paymentTerms: TEST_VALUE_PAYMENT_TERMS,
      vendorId: vendor.id,
      adjustments: [{
        description: 'test',
        value: 75,
        type: ADJUSTMENT_TYPE_VALUES.amount,
        prorate: ADJUSTMENT_PRORATE_VALUES.notProrated,
        relationToTotal: ADJUSTMENT_RELATION_TO_TOTAL_VALUES.inAdditionTo,
        exportToAccounting: true,
        fundDistributions: [{
          fundId: fund.id,
          distributionType: FUND_DISTR_TYPE.percent,
          value: 100,
        }],
      }],
      batchGroupId: batchGroup.id,
    });

    this.visit(`/invoice/edit/${invoice.id}`);
    await invoiceForm.whenLoaded();
  });

  it('displays an edit invoice form with value loaded from back-end', () => {
    expect(invoiceForm.termsInputValue).to.be.equal(TEST_VALUE_PAYMENT_TERMS);
  });

  it('exchange rate fields are not presented', () => {
    expect(invoiceForm.currentExchangeRate).to.be.false;
    expect(invoiceForm.exchangeRate.isPresent).to.be.false;
    expect(invoiceForm.useSetExchangeRate.isPresent).to.be.false;
  });

  describe('Add data and save invoice', () => {
    const confirmation = new ConfirmationInteractor('#invoice-is-not-unique-confirmation');

    beforeEach(async function () {
      await invoiceForm.termsInput.fill('new test value');
      await invoiceForm.formFooter.saveButton.click();
      // await confirmation.confirm();
    });

    it('save button is enabled and confirmation has shown', () => {
      expect(invoiceForm.formFooter.saveButton.isDisabled).to.be.false;
      expect(confirmation.isPresent).to.be.true;
    });
  });

  describe('Select currency other than system default currency', () => {
    beforeEach(async function () {
      await invoiceForm.currency.options.list(1).click();
    });

    it('current exchange rate and use set exchange rate are visible', () => {
      expect(invoiceForm.currentExchangeRate).to.be.true;
      expect(invoiceForm.useSetExchangeRate.isPresent).to.be.true;
    });

    describe('Check use set exchange rate', () => {
      beforeEach(async function () {
        await invoiceForm.useSetExchangeRate.clickAndBlur();
      });

      it('exchange rate field is visible', () => {
        expect(invoiceForm.exchangeRate.isPresent).to.be.true;
      });
    });
  });
});
