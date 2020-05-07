import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';
import { Response } from 'miragejs';

import { ConfirmationInteractor } from '@folio/stripes-acq-components/test/bigtest/interactors';

import { INVOICE_API, INVOICE_STATUS } from '../../../../src/common/constants';
import setupApplication from '../../helpers/setup-application';
import InvoiceDetails from '../../interactors/InvoiceDetails';

const createInvoice = (server, status, withLines = true) => {
  const batchGroup = server.create('batchgroup');
  const vendor = server.create('vendor');
  const invoice = server.create('invoice', {
    status,
    vendorId: vendor.id,
    batchGroupId: batchGroup.id,
  });

  if (withLines) {
    server.create('invoiceline', {
      invoiceId: invoice.id,
    });
  }

  return invoice;
};

describe('Invoice details - pay action', () => {
  setupApplication();

  const invoiceDetails = new InvoiceDetails();
  const payConfirmation = new ConfirmationInteractor('#pay-invoice-confirmation');

  const testAvailabilityOptions = [
    [INVOICE_STATUS.open, true, false],
    [INVOICE_STATUS.reviewed, true, false],
    [INVOICE_STATUS.approved, true, true],
    [INVOICE_STATUS.paid, true, false],
    [INVOICE_STATUS.cancelled, true, false],
    [INVOICE_STATUS.open, false, false],
    [INVOICE_STATUS.reviewed, false, false],
    [INVOICE_STATUS.approved, false, false],
    [INVOICE_STATUS.paid, false, false],
    [INVOICE_STATUS.cancelled, false, false],
  ];

  testAvailabilityOptions.forEach(testOptions => {
    const [status, withLines, isPresent] = testOptions;

    describe(`availability for invoice with ${status} and with lines ${withLines}`, () => {
      beforeEach(async function () {
        const invoice = createInvoice(this.server, status, withLines);

        this.visit(`/invoice/view/${invoice.id}`);
        await invoiceDetails.whenLoaded();
      });

      it(`should ${isPresent ? '' : 'not'} be preent`, () => {
        expect(invoiceDetails.actions.buttonPayInvoice.isPresent).to.equal(isPresent);
      });
    });
  });

  describe('confirmation modal open', () => {
    beforeEach(async function () {
      const invoice = createInvoice(this.server, INVOICE_STATUS.approved, true);

      this.visit(`/invoice/view/${invoice.id}`);
      await invoiceDetails.whenLoaded();
      await invoiceDetails.actions.buttonPayInvoice.click();
    });

    it('should be done after pay button click', () => {
      expect(payConfirmation.isPresent).to.be.true;
    });
  });

  describe('confirmation modal close', () => {
    beforeEach(async function () {
      const invoice = createInvoice(this.server, INVOICE_STATUS.approved, true);

      this.visit(`/invoice/view/${invoice.id}`);
      await invoiceDetails.whenLoaded();
      await invoiceDetails.actions.buttonPayInvoice.click();
      await payConfirmation.confirm();
    });

    it('should be done after submit button click', () => {
      expect(payConfirmation.isPresent).to.be.false;
    });
  });

  describe('click pay invoice that cant be payed', () => {
    beforeEach(async function () {
      const invoice = createInvoice(this.server, INVOICE_STATUS.approved);

      this.server.put(`${INVOICE_API}/${invoice.id}`, () => {
        return new Response(400, { errors: [{ code: 'test', message: 'cant approve' }] });
      });
      this.visit(`/invoice/view/${invoice.id}`);
      await invoiceDetails.whenLoaded();
      await invoiceDetails.actions.buttonPayInvoice.click();
      await payConfirmation.confirm();
      await invoiceDetails.whenLoaded();
    });

    it('stays on invoice details', () => {
      expect(invoiceDetails.isPresent).to.be.true;
    });
  });
});
