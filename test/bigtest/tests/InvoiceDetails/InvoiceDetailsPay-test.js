import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';
import { Response } from 'miragejs';

import {
  CalloutInteractor,
  ConfirmationInteractor,
} from '@folio/stripes-acq-components/test/bigtest/interactors';

import {
  CONFIG_MODULE_INVOICE,
  CONFIG_NAME_APPROVALS,
  INVOICE_API,
  INVOICE_STATUS,
  ERROR_CODES,
} from '../../../../src/common/constants';
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

describe('Invoice details - pay action', function () {
  setupApplication();

  this.timeout(10000);

  const invoiceDetails = new InvoiceDetails();
  const payConfirmation = new ConfirmationInteractor('#pay-invoice-confirmation');
  const approveAndPayConfirmation = new ConfirmationInteractor('#approve-pay-invoice-confirmation');
  const callout = new CalloutInteractor();

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

  describe('fundCannotBePaid error is visible on pay', () => {
    beforeEach(async function () {
      const invoice = createInvoice(this.server, INVOICE_STATUS.approved, true);

      const ERROR_RESPONSE = {
        'errors': [{
          'message': '',
          'code': ERROR_CODES.fundCannotBePaid,
          'parameters': [],
          'id': invoice.id,
        }],
        'total_records': 1,
      };

      this.server.put(`${INVOICE_API}/:id`, ERROR_RESPONSE, 422);

      this.visit(`/invoice/view/${invoice.id}`);
      await invoiceDetails.whenLoaded();
      await invoiceDetails.actions.buttonPayInvoice.click();
      await payConfirmation.confirm();
      await invoiceDetails.whenLoaded();
    });

    it('displays error toast', () => {
      expect(callout.list(0).message).to.equal('One or more Fund distributions on this invoice can not be paid, because there is not enough money in the budget');
    });
  });

  describe('fundCannotBePaid error is visible on approve and pay', () => {
    beforeEach(async function () {
      const invoice = createInvoice(this.server, INVOICE_STATUS.reviewed, true);

      this.server.create('config', {
        module: CONFIG_MODULE_INVOICE,
        configName: CONFIG_NAME_APPROVALS,
        enabled: true,
        value: '{"isApprovePayEnabled":true}',
      });

      const ERROR_RESPONSE = {
        'errors': [{
          'message': '',
          'code': ERROR_CODES.fundCannotBePaid,
          'parameters': [],
          'id': invoice.id,
        }],
        'total_records': 1,
      };

      this.server.put(`${INVOICE_API}/:id`, ERROR_RESPONSE, 422);

      this.visit(`/invoice/view/${invoice.id}`);
      await invoiceDetails.whenLoaded();
      await invoiceDetails.actions.buttonApproveInvoice.click();
      await approveAndPayConfirmation.confirm();
      await invoiceDetails.whenLoaded();
    });

    it('displays error toast', () => {
      expect(callout.list(0).message).to.equal('One or more Fund distributions on this invoice can not be paid, because there is not enough money in the budget');
    });
  });
});
