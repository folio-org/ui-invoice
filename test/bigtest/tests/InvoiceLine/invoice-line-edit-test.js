import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { STATUS_OPEN } from '../../../../src/common/constants';
import setupApplication from '../../helpers/setup-application';
import InvoiceLineFormInteractor from '../../interactors/InvoiceLineFormInteractor';

describe('Invoice line edit', () => {
  setupApplication();

  const invoiceLineForm = new InvoiceLineFormInteractor();

  beforeEach(async function () {
    const vendor = this.server.create('vendor');
    const invoice = this.server.create('invoice', {
      vendorId: vendor.id,
    });
    const invoiceLine = this.server.create('line', {
      description: 'old value',
      invoiceId: invoice.id,
      invoiceLineStatus: STATUS_OPEN,
      fundDistributions: [{
        code: 'USHIST',
        encumbrance: '1c8fc9f4-d2cc-4bd1-aa9a-cb02291cbe65',
        fundId: '1d1574f1-9196-4a57-8d1f-3b2e4309eb81',
        percentage: 50,
      }],
      subTotal: 300,
      quantity: 1,
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
      await invoiceLineForm.buttonSave.click();
    });

    it('closes edit invoice line form', () => {
      expect(invoiceLineForm.isPresent).to.be.false;
    });
  });
});
