import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { ConfirmationInteractor } from '@folio/stripes-acq-components/test/bigtest/interactors';

import { INVOICE_API, INVOICE_STATUS } from '../../../../src/common/constants';

import setupApplication from '../../helpers/setup-application';
import InvoiceDetails from '../../interactors/InvoiceDetails';
import { APPROVE_ERROR_CODES } from '../../../../src/common/utils';

const createInvoice = (server, status, withLines = true) => {
  const vendor = server.create('vendor');
  const invoice = server.create('invoice', {
    status,
    vendorId: vendor.id,
  });

  if (withLines) {
    server.create('line', {
      invoiceId: invoice.id,
    });
  }

  return invoice;
};

describe('Invoice details - approve action', () => {
  setupApplication();

  const invoiceDetails = new InvoiceDetails();

  const testAvailabilityOptions = [
    [INVOICE_STATUS.open, true, true],
    [INVOICE_STATUS.reviewed, true, true],
    [INVOICE_STATUS.approved, true, false],
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
        expect(invoiceDetails.buttonApproveInvoice.isPresent).to.equal(isPresent);
      });
    });
  });

  describe('confirmation modal open', () => {
    const approveConfirmation = new ConfirmationInteractor('#approve-invoice-confirmation');

    beforeEach(async function () {
      const invoice = createInvoice(this.server, INVOICE_STATUS.open, true);

      this.visit(`/invoice/view/${invoice.id}`);
      await invoiceDetails.whenLoaded();
      await invoiceDetails.buttonApproveInvoice.click();
    });

    it('should be done after approve button click', () => {
      expect(approveConfirmation.isPresent).to.be.true;
    });
  });

  describe('confirmation modal close', () => {
    const approveConfirmation = new ConfirmationInteractor('#approve-invoice-confirmation');

    beforeEach(async function () {
      const invoice = createInvoice(this.server, INVOICE_STATUS.review, true);

      this.visit(`/invoice/view/${invoice.id}`);
      await invoiceDetails.whenLoaded();
      await invoiceDetails.buttonApproveInvoice.click();
      await approveConfirmation.confirm();
    });

    it('should be done after submit button click', () => {
      expect(approveConfirmation.isPresent).to.be.false;
    });
  });

  describe('approve error is visible', () => {
    const approveConfirmation = new ConfirmationInteractor('#approve-invoice-confirmation');

    beforeEach(async function () {
      const invoice = createInvoice(this.server, INVOICE_STATUS.review, true);

      const INVOICE_APPROVE_RESPONSE = {
        'errors': [{
          'message': 'Voucher number prefix must contains only Unicode letters',
          'code': APPROVE_ERROR_CODES.voucherNumberPrefixNotAlpha,
          'parameters': [],
          'id': invoice.id,
        }],
        'total_records': 1,
      };

      this.server.put(`${INVOICE_API}/:id`, INVOICE_APPROVE_RESPONSE, 422);

      this.visit(`/invoice/view/${invoice.id}`);
      await invoiceDetails.whenLoaded();
      await invoiceDetails.buttonApproveInvoice.click();
      await approveConfirmation.confirm();
    });

    it('should close Confirmation Modal and open Error modal', () => {
      expect(approveConfirmation.isPresent).to.be.false;
    });
  });
});
