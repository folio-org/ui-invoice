import React from 'react';
import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { Button } from '@folio/stripes/components';
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

describe('Invoice edit', function () {
  setupApplication({
    modules: [{
      type: 'plugin',
      name: '@folio/plugin-find-organization',
      displayName: 'Find organization',
      pluginType: 'find-organization',
      /* eslint-disable-next-line react/prop-types */
      module: ({ selectVendor }) => (
        <Button
          data-test-plugin-find-organization
          onClick={() => selectVendor({ id: 'test_id', name: 'Test' })}
        >
          Organization lookup
        </Button>
      ),
    }],
  });

  this.timeout(10000);

  const invoiceForm = new InvoiceFormInteractor();

  beforeEach(async function () {
    const batchGroup = this.server.create('batchgroup');
    const fund = this.server.create('fund');

    fund.fund.id = fund.id;
    const vendor = this.server.create('vendor');
    const invoice = this.server.create('invoice', {
      paymentTerms: TEST_VALUE_PAYMENT_TERMS,
      vendorId: vendor.id,
      lockTotal: 100,
      adjustments: [{
        description: 'test',
        value: 75,
        type: ADJUSTMENT_TYPE_VALUES.amount,
        prorate: ADJUSTMENT_PRORATE_VALUES.notProrated,
        relationToTotal: ADJUSTMENT_RELATION_TO_TOTAL_VALUES.inAdditionTo,
        exportToAccounting: false,
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

  it('use set exchange rate is not checked and exhange rate is read only', () => {
    expect(invoiceForm.exchangeRateReadOnly).to.be.equal('');
    expect(invoiceForm.useSetExchangeRate.isChecked).to.be.false;
  });

  it('lock total is checked', () => {
    expect(invoiceForm.lockTotal.isChecked).to.be.true;
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

    describe('Check use set exchange rate and fill exchange rate', () => {
      beforeEach(async function () {
        await invoiceForm.useSetExchangeRate.clickAndBlur();
        await invoiceForm.exchangeRate.fill('1');
      });

      it('use set exchange rate is checked and exchange rate is filled', () => {
        expect(invoiceForm.exchangeRate.value).to.be.equal('1');
        expect(invoiceForm.useSetExchangeRate.isChecked).to.be.true;
      });
    });
  });

  describe('Select vendor from organization lookup', () => {
    beforeEach(async function () {
      await invoiceForm.organizationLookupBtn();
    });

    it('vendor is updated', () => {
      expect(invoiceForm.vendorField.value).to.be.equal('Test');
    });
  });

  describe('Uncheck lock total', () => {
    beforeEach(async function () {
      await invoiceForm.lockTotal.clickAndBlur();
    });

    it('should reset manual amount', () => {
      expect(invoiceForm.lockTotalAmount.value).to.be.equal('');
    });
  });
});
