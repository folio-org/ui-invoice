import { beforeEach, describe } from '@bigtest/mocha';
import { expect } from 'chai';

import { INVOICE_STATUS } from '../../../../src/common/constants';
import setupApplication from '../../helpers/setup-application';
import EditVoucherView from '../../interactors/EditVoucherView';

describe('Edit voucher information', () => {
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

    const voucher = this.server.create('voucher', {
      invoiceId: invoice.id,
    });

    this.visit(`/invoice/view/${invoice.id}/voucher/${voucher.id}/edit`);
    await editVoucherView.whenLoaded();
  });

  it('Voucher edit form should be displayed', () => {
    expect(editVoucherView.voucherNumberInput).to.be.true;
    expect(editVoucherView.disbursementNumberInput).to.be.true;
    expect(editVoucherView.disbursementAmountInput).to.be.true;
  });
});
