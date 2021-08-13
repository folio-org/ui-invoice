import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { INVOICE_STATUS } from '../../../../src/common/constants';
import setupApplication from '../../helpers/setup-application';
import InvoiceDetails from '../../interactors/InvoiceDetails';
import VoucherView from '../../interactors/VoucherView';

describe('Voucher information', function () {
  setupApplication();

  this.timeout(10000);

  const invoiceDetails = new InvoiceDetails();
  const voucherView = new VoucherView();

  beforeEach(async function () {
    const user = this.server.create('user', {
      personal: {
        firstName: 'Diku',
        lastName: 'Admin',
      },
    });
    const invoice = this.server.create('invoice', {
      approvedBy: user.id,
      status: INVOICE_STATUS.approved,
    });

    this.server.create('vendor', {
      id: invoice.vendorId,
    });

    const voucher = this.server.create('voucher', {
      invoiceId: invoice.id,
      invoiceCurrency: invoice.currency,
    });

    this.server.create('voucherLine', {
      voucherId: voucher.id,
      fundDistributions: [{ code: 'TEST_CODE' }],
    });

    this.visit(`/invoice/view/${invoice.id}`);
    await invoiceDetails.whenLoaded();
  });

  it('voucher information accordion should be displayed', () => {
    expect(invoiceDetails.voucherAccordion).to.be.true;
  });

  describe('click voucher view button', () => {
    beforeEach(async function () {
      await invoiceDetails.buttonVoucherView.click();
    });

    it('should redirect to voucher view page', () => {
      expect(invoiceDetails.isPresent).to.be.false;
      expect(voucherView.isPresent).to.be.true;
      expect(voucherView.voucherAccordion).to.be.true;
      expect(voucherView.voucherLinesAccordion).to.be.true;
    });
  });
});
