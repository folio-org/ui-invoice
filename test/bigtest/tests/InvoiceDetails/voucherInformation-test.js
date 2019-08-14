import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { INVOICE_STATUS } from '../../../../src/common/constants';
import setupApplication from '../../helpers/setup-application';
import InvoiceDetails from '../../interactors/InvoiceDetails';

describe('Voucher information', () => {
  setupApplication();

  const invoiceDetails = new InvoiceDetails();

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
    });

    this.visit(`/invoice/view/${invoice.id}`);
    await invoiceDetails.whenLoaded();
  });

  it('voucher information accordion should be displayed', () => {
    expect(invoiceDetails.voucherAccordion).to.be.true;
  });
});
