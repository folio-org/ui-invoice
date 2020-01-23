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
});
