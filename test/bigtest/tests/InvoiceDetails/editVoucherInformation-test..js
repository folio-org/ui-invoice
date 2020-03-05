import { beforeEach, describe } from '@bigtest/mocha';

import { INVOICE_STATUS } from '../../../../src/common/constants';
import setupApplication from '../../helpers/setup-application';
import EditVoucherView from '../../interactors/EditVoucherView';

describe.only('Edit voucher information', () => {
  setupApplication();

  const editVoucherView = new EditVoucherView();

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

    // this.server.create('vendor', {
    //   id: invoice.vendorId,
    // });

    const voucher = this.server.create('voucher', {
      invoiceId: invoice.id,
      invoiceCurrency: invoice.currency,
    });

    this.visit(`/invoice/view/${invoice.id}/voucher/${voucher.id}/edit`);
    await editVoucherView.whenLoaded();
  });

  it('Voucher edit form should be displayed', () => {
    expect(editVoucherView.voucherForm).to.be.true;
  });
});
