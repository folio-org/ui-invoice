import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { FUND_DISTR_TYPE } from '@folio/stripes-acq-components';

import {
  ADJUSTMENT_PRORATE_VALUES,
  ADJUSTMENT_RELATION_TO_TOTAL_VALUES,
  ADJUSTMENT_TYPE_VALUES,
} from '../../../../src/common/constants';
import setupApplication from '../../helpers/setup-application';
import InvoiceFormInteractor from '../../interactors/InvoiceFormInteractor';
import InvoicesListInteractor from '../../interactors/InvoicesList';

const TEST_VALUE_PAYMENT_TERMS = 'some test value';

describe('Invoice edit', () => {
  setupApplication();

  const invoiceForm = new InvoiceFormInteractor();

  beforeEach(async function () {
    const fund = this.server.create('fund');
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
        fundDistributions: [{
          fundId: fund.id,
          distributionType: FUND_DISTR_TYPE.percent,
          value: 100,
        }],
      }],
    });

    this.visit(`/invoice/view/${invoice.id}?layer=edit`);
    await invoiceForm.whenLoaded();
  });

  it('displays an edit invoice form with value loaded from back-end', () => {
    expect(invoiceForm.termsInputValue).to.be.equal(TEST_VALUE_PAYMENT_TERMS);
  });

  describe('Add data and save invoice', () => {
    const invoicesList = new InvoicesListInteractor();

    beforeEach(async function () {
      await invoiceForm.termsInput.fill('new test value');
      await invoiceForm.saveButton.click();
      await invoicesList.whenLoaded();
    });

    it('closes edit form', () => {
      expect(invoiceForm.isPresent).to.be.false;
    });
  });
});
