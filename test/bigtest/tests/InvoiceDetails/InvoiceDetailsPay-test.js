import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { ConfirmationInteractor } from '@folio/stripes-acq-components/test/bigtest/interactors';

import { INVOICE_STATUS } from '../../../../src/common/constants';

import setupApplication from '../../helpers/setup-application';
import InvoiceDetails from '../../interactors/InvoiceDetails';

const createInvoice = (server, status, withLines = true) => {
  const vendor = server.create('vendor');
  const invoice = server.create('invoice', {
    status,
    vendorId: vendor.id,
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
    const payConfirmation = new ConfirmationInteractor('#pay-invoice-confirmation');

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
    const payConfirmation = new ConfirmationInteractor('#pay-invoice-confirmation');

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
});
