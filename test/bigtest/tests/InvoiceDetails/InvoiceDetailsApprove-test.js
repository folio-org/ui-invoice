import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import {
  CalloutInteractor,
} from '@folio/stripes-acq-components/test/bigtest/interactors';

import { INVOICE_API, INVOICE_STATUS, ERROR_CODES } from '../../../../src/common/constants';

import setupApplication from '../../helpers/setup-application';
import InvoiceDetails from '../../interactors/InvoiceDetails';
import ApproveInvoiceModalInteractor from '../../interactors/ApproveInvoiceModalInteractor';

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

describe('Invoice details - approve action', function () {
  setupApplication();

  this.timeout(10000);
  const invoiceDetails = new InvoiceDetails();
  const approveConfirmation = new ApproveInvoiceModalInteractor();
  const callout = new CalloutInteractor();

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

      it(`should ${isPresent ? '' : 'not'} be present`, () => {
        expect(invoiceDetails.actions.buttonApproveInvoice.isPresent).to.equal(isPresent);
      });
    });
  });

  describe('confirmation modal open', () => {
    beforeEach(async function () {
      const invoice = createInvoice(this.server, INVOICE_STATUS.open, true);

      this.visit(`/invoice/view/${invoice.id}`);
      await invoiceDetails.whenLoaded();
      await invoiceDetails.actions.buttonApproveInvoice.click();
    });

    it('should be done after approve button click', () => {
      expect(approveConfirmation.isPresent).to.be.true;
    });
  });

  describe('confirmation modal close', () => {
    beforeEach(async function () {
      const invoice = createInvoice(this.server, INVOICE_STATUS.review, true);

      this.visit(`/invoice/view/${invoice.id}`);
      await invoiceDetails.whenLoaded();
      await invoiceDetails.actions.buttonApproveInvoice.click();
      await approveConfirmation.whenLoaded();
      await approveConfirmation.confirm();
    });

    it('should be done after submit button click', () => {
      expect(approveConfirmation.isPresent).to.be.false;
    });
  });

  describe('approve error is visible', () => {
    beforeEach(async function () {
      const invoice = createInvoice(this.server, INVOICE_STATUS.review, true);

      const INVOICE_APPROVE_RESPONSE = {
        'errors': [{
          'message': 'Voucher number prefix must contains only Unicode letters',
          'code': ERROR_CODES.voucherNumberPrefixNotAlpha,
          'parameters': [],
          'id': invoice.id,
        }],
        'total_records': 1,
      };

      this.server.put(`${INVOICE_API}/:id`, INVOICE_APPROVE_RESPONSE, 422);

      this.visit(`/invoice/view/${invoice.id}`);
      await invoiceDetails.whenLoaded();
      await invoiceDetails.actions.buttonApproveInvoice.click();
      await approveConfirmation.whenLoaded();
      await approveConfirmation.confirm();
    });

    it('should close Confirmation Modal and open Error modal', () => {
      expect(approveConfirmation.isPresent).to.be.false;
    });
  });

  describe('fundCannotBePaid error is visible', () => {
    beforeEach(async function () {
      const invoice = createInvoice(this.server, INVOICE_STATUS.review, true);

      const INVOICE_APPROVE_RESPONSE = {
        'errors': [{
          'message': '',
          'code': ERROR_CODES.fundCannotBePaid,
          'parameters': [],
          'id': invoice.id,
        }],
        'total_records': 1,
      };

      this.server.put(`${INVOICE_API}/:id`, INVOICE_APPROVE_RESPONSE, 422);

      this.visit(`/invoice/view/${invoice.id}`);
      await invoiceDetails.whenLoaded();
      await invoiceDetails.actions.buttonApproveInvoice.click();
      await approveConfirmation.whenLoaded();
      await approveConfirmation.confirm();
    });

    it('displays error toast', () => {
      expect(callout.list(0).message).to.equal('One or more Fund distributions on this invoice can not be paid, because there is not enough money in the budget');
    });
  });

  describe('budgetExpenseClassNotFound error is visible', () => {
    beforeEach(async function () {
      const invoice = createInvoice(this.server, INVOICE_STATUS.review, true);

      const INVOICE_APPROVE_RESPONSE = {
        'errors': [{
          'message': '',
          'code': ERROR_CODES.budgetExpenseClassNotFound,
          'parameters': [{ key: 'fundCode', value: 'FUND_CODE' }, { key: 'expenseClassName', value: 'Test' }],
          'id': invoice.id,
        }],
        'total_records': 1,
      };

      this.server.put(`${INVOICE_API}/:id`, INVOICE_APPROVE_RESPONSE, 422);

      this.visit(`/invoice/view/${invoice.id}`);
      await invoiceDetails.whenLoaded();
      await invoiceDetails.actions.buttonApproveInvoice.click();
      await approveConfirmation.whenLoaded();
      await approveConfirmation.confirm();
    });

    it('displays error toast', () => {
      expect(callout.list(0).message).to.include('Test');
      expect(callout.list(0).message).to.include('FUND_CODE');
    });
  });
});
